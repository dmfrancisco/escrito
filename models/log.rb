class Log
  include Mongoid::Document
  field :document, type: String
  field :command, type: String
  field :arg0, type: Integer
  field :arg1, type: String
  field :arg2, type: Integer
  field :arg3, type: String

  def self.generate_and_save_id
    begin
      document_id = Digest::MD5.hexdigest(Time.now.to_i.to_s)[0..9]
      Log.create(document: document_id)
    end while Log.where(document: document_id).size != 1
    document_id
  end
end
