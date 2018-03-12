module ShortCommentPlugin
  module Hooks
    class LayoutHook < Redmine::Hook::ViewListener
	
      def view_layouts_base_html_head(context={})
        <<-TAGS
          #{javascript_include_tag 'comment.js', :plugin => 'redmine_issue_comment'}
        TAGS
      end

    end
  end
end
