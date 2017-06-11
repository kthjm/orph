#### 思い立ったときの感じを書いておいて行き詰まった時にアレしたい.md

[brux](https://github.com/kthjm/brux)の融通の利かなさとかに限界が訪れ始め、くわえて変数名に乗れない感じなのでargux

animationや{passive:true}など、Root以外にもstatefulなComponentを使う場合があることを知ったので、というかrenderingに伴うReactEventがRootだけなの厳しいので、各statefulがそれぞれインスタンスを持って自律的に振る舞えるようにしたい。今の自分のstatefulは完全に親からのpropsのみに依存する無脳Componentで、形式上はstatefulだけどstateを使わないのでstatefulじゃない。lifecycleをちょろっと使うだけ。なので、どうせなら自分のstateを持って自律的にrenderしてもいいじゃないかという。feedとか。

```js:Root.js
//stateful
import {Argus,on,off,supply} from "argux";
const {name,init,fin} = new Argus({
  name:name,
  causes:[{...},{...},{...}]
});
```

```js:Stateless.js
//stateless
import {Atra} from "argux";
const a = new Atra({...});
```

Allocって名前はマズいし、なんとなく[ATRA MIXTA](https://www.google.co.jp/search?biw=1471&bih=799&tbm=isch&sa=1&q=atra+mixta&oq=atra+mixta&gs_l=img.3.1.0i19k1l9j0i30i19k1.237943.243693.0.243894.9.9.0.0.0.0.187.937.0j6.6.0....0...1.1j4.64.img..3.6.936...0j0i4k1j0i4i24k1j0i10k1j0i30k1.Nc9-80yKB_g)から拝借。

AtraならMikazuki関連かなと思ってたら[Argus](http://ejje.weblio.jp/content/Argus)って言葉を見つけたのでそれで。package名もcausuxからarguxに変更。
