<?php

namespace App\Enums;

class Responses
{

    const SUCCESS = 'success';
    const ERROR = 'error';

    const STATUS_OK = 200;
    const STATUS_ERR = 500;
    const STATUS_ERR_AUTH = 503;
    const STATUS_NOT_FOUND = 404;

    const SAVED = 'Your answer has been saved.';
    const NOT_SAVED = 'We couldn\'t manage to save your answer. Try again later.';
    const QUESTION_NOT_FOUND = 'Question not found!';
    const NOT_USERS_QUESTION = 'This question doesn\'t belong to you >:(';
    const QUESTION_SENT = 'Your questions sent successfully. You will be informed when the question answered.';
    const QUESTION_NOT_SEND = 'We couldn\'t manage to send your question. Try again later.';
    const NOT_YOU = 'This is not you.';
    const CANT_ASK_YOURSELF = 'You can\'t ask a question to yourself.';
    const USER_NOT_FOUND = 'This user not exist.';
    const NOT_LOGGED_IN_FOR_QUESTIONS = 'You need to log in to see questions.';
    const LOGIN_TO_FOLLOW = 'You need to login to follow someone';
    const CANT_FOLLOW_YOURSELF = 'You can\'t follow yourself :)';
}
