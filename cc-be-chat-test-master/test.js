import test from 'ava';

var fs = require('fs');

var words = new Set();

// 加载过滤字
function loadTXT() {
    var data =fs.readFileSync("D:\\code\\cc-be-chat-test-master\\list.txt");
    var list = data.toString().split("\n");
    for(var i=0;i<list.length;++i) {
      words.add(list[i]);
    }
  }

function checkWords(message){
  if(message == "") return message;
  var word = message;
  words.forEach(function(v,k) {
    word = word.replace(v,function(s){
      var str = "";
      for(var j = 0; j < s.length; j++){
        str += "*";
      }
      return str;
    })
  })

  return word;
}

loadTXT();

test("checkWords test",t => {
      var word = checkWords("fux");
      t.is(word, '***');
})
