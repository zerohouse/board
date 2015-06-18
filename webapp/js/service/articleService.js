app.service('$article', function () {
    var list = this.list = [];

    function Article(head, body) {
        this.head = head;
        this.body = body;
    }

    Article.prototype.equals = function (obj) {
        if (obj == this)
            return true;
        if (obj.id == this.id)
            return true;
        return false;
    };

    Article.prototype.remove = function () {
        list.splice(list.indexOf(this), 1);
    };

    this.newArticle = function () {
        var article = new Article();
        article.mod = true;
        list.push(article);
    };

});