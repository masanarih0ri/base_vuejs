// データはサーバーではなくlocalstorageへ保存する

let STORAGE_KEY = 'todo-vuejs';
let todoStorage = {
  fetch: function() {
    let todos = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )

    todos.forEach(function(todo, index) {
      todo.id = index
    })
    todoStorage.uid = todos.length
    return todos
  },
  save: function(todos) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}

/*
この公式のコードの内容については詳しく説明しませんが、これは Storage API を使ったデータの取得・保存の処理だけを抜き出したものです。 小さなライブラリだと思ってください。 なぜ、こういった処理の抜き出しをするかは、書籍 CHAPTER7 のコラム（219ページ）で説明しています。 特に手を加える必要はないため、このコードは main.js ファイルの一番上の方に加えておきましょう。

実際にストレージに保存されるデータのフォーマットは、次のような JSON です。

[
  { "id": 1, "comment": "新しいToDo1", "state": 0 },
  { "id": 2, "comment": "新しいToDo2", "state": 0 }
]
*/

// ルートインスタンスを作成

const app = new Vue({
  el: '#app',
  data: {
    todos: []
  },
  methods: {
    // TODO追加の処理
    doAdd: function(event, value) {
      // refでつけておいたDOM要素を参照
      let comment = this.$refs.comment
      // 入力がなければreturn
      if(!comment.value.length) {
        return
      }
      // 入力があった場合
      // id, comment, stateの内容をtodosに入れる
      // 作業状態(state)はデフォルト「作業中=0」で作成
      this.todos.push({
        id: todoStorage.uid++,
        comment: comment.value,
        state: 0
      })
      // 内容を空にする
      comment.value = ''
    },
    // 状態の変更用のメソッド
    doChangeState: function(item) {
      item.state = item.state ? 0 : 1
    },
    // 削除の処理
    doRemove: function(item) {
      let index = this.todos.indexOf(item)
      this.todos.splice(index, 1)
    }
  },

  /*
  doAdd メソッドの最後に todoStorage.save メソッドを使って保存してもよいが、追加・削除・作業状態の変更すべて同じ処理をしなければいけません。

  todos データの内容が変わると、自動的にストレージへ保存したいので、watch オプションの「ウォッチャ」機能を使う。 ウォッチャはデータの変化に反応して、あらかじめ登録しておいた処理を自動的に行います。
  */
  watch: {
    // オプションを使う場合はオブジェクト形式にする
    todos: {
      // 引数はwatchしているプロパティの変更後の値
      handler: function(todos) {
        todoStorage.save(todos)
      },
      // deepオプションでネストしている情報も監視できる
      deep: true
    }
  },

  created() {
    // インスタンス生成時に自動的にfetchする
    this.todos = todoStorage.fetch()
  }
})
