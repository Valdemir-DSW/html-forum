<?php
$file = 'data.json';

// Carregar dados JSON
$data = file_get_contents($file);
$forumData = json_decode($data, true);

// Verificar ação e processar de acordo
if ($_SERVER['REQUEST_METHOD'] === 'POST' && isset($_POST['action'])) {
    $action = $_POST['action'];

    if ($action === 'create_topic' && isset($_POST['title']) && isset($_POST['content'])) {
        $title = $_POST['title'];
        $content = $_POST['content'];

        // Gerar ID único para o novo tópico
        $topicId = uniqid();

        // Criar o novo tópico e adicioná-lo aos dados do fórum
        $newTopic = [
            'id' => $topicId,
            'title' => $title,
            'content' => $content,
            'comments' => []
        ];
        $forumData[] = $newTopic;
        file_put_contents($file, json_encode($forumData));
    } elseif ($action === 'add_comment' && isset($_POST['topicId']) && isset($_POST['content'])) {
        $topicId = $_POST['topicId'];
        $content = $_POST['content'];

        // Encontrar o tópico pelo ID e adicionar o comentário
        foreach ($forumData as &$topic) {
            if ($topic['id'] === $topicId) {
                $commentId = uniqid();
                $newComment = [
                    'id' => $commentId,
                    'content' => $content
                ];
                $topic['comments'][] = $newComment;
                break;
            }
        }
        file_put_contents($file, json_encode($forumData));
    }
} elseif ($_SERVER['REQUEST_METHOD'] === 'GET' && isset($_GET['action']) && $_GET['action'] === 'get_comments' && isset($_GET['topicId'])) {
    $topicId = $_GET['topicId'];

    // Encontrar o tópico pelo ID e retornar apenas os comentários desse tópico
    $comments = [];
    foreach ($forumData as $topic) {
        if ($topic['id'] === $topicId && isset($topic['comments'])) {
            $comments = $topic['comments'];
            break;
        }
    }

    // Retornar os comentários como JSON
    header('Content-Type: application/json');
    echo json_encode($comments);
    exit; // Importante: sair do script para evitar que outros dados sejam enviados
}

// Retornar os dados do fórum como JSON
header('Content-Type: application/json');
echo json_encode($forumData);
?>
