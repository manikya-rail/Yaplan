class V1::CommunicationsController < ApplicationController
	before_action :authenticate_user!

	def create
		# get_step
		communication = Communication.new(communication_params)
		if communication.save
			render json: communication, status: :created
		else
			render json: communication, status: :unprocessable_entity
		end
	end

	def update
		communication = Communication.find(params[:id])
		if communication.update(communication_params)
			render json: communication, status: :created
		else
			render json: communication, status: :unprocessable_entity
		end
	end

	def show
		@communication = Communication.find(params[:id])
		render json: @communication, status: :created
	end

	private

	def communication_params
		params.require(:communication).permit(:id, :subject,:message,:project_workflow_step_id,:communication_mode,recepient_emails: [], attachments_attributes: [:file_attachment, :_destroy, :id])
	end

	def get_step
		@step = ProjectWorkflowStep.find(params[:project_workflow_step_id])
	end

end
