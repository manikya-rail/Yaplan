require 'test_helper'

class CommentTest < ActiveSupport::TestCase
  def comment
    @comment ||= Comment.new
  end

  def project
    @project ||= build_stubbed(:project)
  end

  def document
    @document ||= build_stubbed(:document)
  end

  def user
    @user ||= build_stubbed(:another_user)
  end

  it 'should create a comment' do
    comment = create(:comment)
    assert comment.valid?
  end

  it 'should create a comment for project' do
    comment = project.comments.create(attributes_for(:comment).merge(commenter: user))
    assert project.comments.size.must_equal 1
  end

  it 'should create a comment for document' do
    comment = document.comments.create(attributes_for(:comment).merge(commenter: user))
    assert document.comments.size.must_equal 1
  end

  it 'should not create comment without comment text' do
    comment = build_stubbed(:empty_text_comment)
    assert !comment.valid?, "Can't create empty "
  end

  it 'should not create comment without commenter' do
    comment = build_stubbed(:comment_without_commenter)
    assert !comment.valid?, "Can't create comment without commenter"
  end
end
