 
namespace :db do

	desc "Dumps the  grapple database"
	task :backup => :environment do
		cmd = nil
		with_config do |app, host, db, user|
			cmd = "pg_dump --host #{host} --username #{user} --verbose --clean --no-owner --no-acl --format=c #{db} | gzip > #{ENV['DB_BACKUP_DIR']}/grapple_#{Date.today.to_s}.dump"
		end
		puts cmd
		exec cmd
		puts " ******************** Successfully Backup created ******************* "
	end

	task :restore => :environment do
    	cmd = nil
    	with_config do |app, host, db, user|
      		cmd = "pg_restore --verbose --host #{host} --username #{user} --clean --no-owner --no-acl --dbname #{db} #{Rails.root}/db/#{app}.dump"
   		 end
    	Rake::Task["db:drop"].invoke
    	Rake::Task["db:create"].invoke
   		puts cmd
    	exec cmd
    	puts " ******************** Successfully Backup restored ******************* "
	end

	private

	def with_config
		yield Rails.application.class.parent_name.underscore,
		ActiveRecord::Base.connection_config[:host],
		ActiveRecord::Base.connection_config[:database],
		ActiveRecord::Base.connection_config[:username]
	end

end