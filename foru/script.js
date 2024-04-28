
$(document).ready(function() {

    loadTopics();

    $('#topicForm').submit(function(event) {
        event.preventDefault();
        let topicTitle = $('#topicTitle').val();
        let topicContent = $('#topicContent').val();
        if (topicTitle.trim() !== '' && topicContent.trim() !== '') {
            createTopic(topicTitle, topicContent);
            $('#topicTitle').val('');
            $('#topicContent').val('');
        }
    });
    

 
    function loadTopics() {
        $.getJSON('forum.php', function(data) {
            let topicsHtml = '';
            data.forEach(function(topic) {
                topicsHtml += `
                    <div class="topic">
                        <h3>${topic.title}</h3>
                        <p>${topic.content}</p>
                        <form class="commentForm">
                            <input type="hidden" name="topicId" value="${topic.id}">
                            <textarea name="commentContent" placeholder="Comente algo Neste tópico"></textarea>
                            <button type="Enviar">Comment</button>
                        </form>
                        <div class="commentsContainer" id="comments-${topic.id}"></div>
                        <button class="showCommentsBtn" data-topic-id="${topic.id}">Exibir comentários</button>

                    </div>
                `;
            });
            $('#topicsContainer').html(topicsHtml);
            attachCommentFormHandlers();
        });
    }

    function attachCommentFormHandlers() {
        $('.commentForm').submit(function(event) {
            event.preventDefault();
            let topicId = $(this).find('input[name="topicId"]').val();
            let commentContent = $(this).find('textarea[name="commentContent"]').val();
            if (commentContent.trim() !== '') {
                addComment(topicId, commentContent);
                $(this).find('textarea[name="commentContent"]').val('');
            }
        });
    }


    $(document).on('click', '.showCommentsBtn', function() {
        let topicId = $(this).data('topic-id');
       
        loadComments(topicId);
    });



    function createTopic(title, content) {

      
    
        $.post('forum.php', { action: 'create_topic', title: title, content: content }, function() {
            loadTopics(); 
        });
    }


    function addComment(topicId, content) {
       
        $.post('forum.php', { action: 'add_comment', topicId: topicId, content: content}, function() {
            loadComments(topicId); 
        });
    }
   

    function loadComments(topicId) {
        $.getJSON('forum.php', { action: 'get_comments', topicId: topicId }, function(comments) {
            let commentsHtml = '';
            comments.forEach(function(comment) {
                commentsHtml += `<div class="comment">${comment.content}</div>`;
            });
            $(`#comments-${topicId}`).html(commentsHtml);
        });
    }
});




