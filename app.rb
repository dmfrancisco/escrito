require 'sinatra'
require 'sinatra/mongoid'
require 'json'
require 'erb'
require 'pusher'
require './models/log'
require 'digest/md5'

# Pusher API Credentials
Pusher.app_id = '6505'
Pusher.key = 'b573ecb0e0447d7126b7'
Pusher.secret = 'afcadad4b8ea2f6f1aec'

# Mongoid configuration
set :mongo_db, 'db'


get '/' do
  document_id = Log.generate_and_save_id
  redirect "/#{document_id}"
end

get '/:document_id' do
  @document_id = params[:document_id]
  erb :document
end

post '/:document_id/sync' do
  @document_id = params[:document_id]
  @socket_id = params[:socket_id]
  process_command(params[:command], "#{params[:user]}", params[:args])

  content_type :json
  { "status" => "ok" }.to_json
end

not_found do
  redirect "/404.html"
end


helpers do
  def process_command(command, user_id, args)

    if command == "join_session"
      user_id = Time.now.to_i # Digest::MD5.hexdigest(new_url)[0..4]
      event_name = "sign_user_#{@socket_id}".gsub(".", "_")
      trigger(event_name, { args: [user_id], user: user_id }, true)
    end

    # The client wants to obtain the current state of the document
    if command == "sync"
      trigger('sync_begin', { args: [""], user: user_id }, true)

      Log.where(document: @document_id).each do |entry|
        args = [entry.arg0, entry.arg1, entry.arg2, entry.arg3]
        # trigger('sync_begin', { args: args, user: user_id }, true)
        event_name = "#{entry.command}_#{@socket_id}".gsub(".", "_")
        trigger(event_name, { args: args, user: user_id }, true) unless entry.command.blank?
      end

      trigger('sync_end', { args: [""], user: user_id }, true)
    end

    # The client has issued an insert, delete or undo command
    if ["insert", "delete", "undo"].include? command
      args[0] = args[0].to_i
      args[2] = args[2].to_i
      args[3] = args[3].to_i if command == 'delete'

      # Insert the command into the log
      Log.create(document: @document_id, command: command, arg0: args[0], arg1: args[1], arg2: args[2], arg3: args[3])

      # Broadcast it to all peers
      trigger(command, { args: args, user: user_id })
    end
  end

  # 'duplicate' specifies if you want to send the message to the client who made the request or not
  def trigger(event_name, hash, duplicate = false)
    channel = Pusher[@document_id]
    if duplicate
      channel.trigger(event_name, hash)
    else
      channel.trigger(event_name, hash, @socket_id)
    end
  end
end
