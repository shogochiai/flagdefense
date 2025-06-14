// 国(くに)の事実(じじつ)データの型定義(かたていぎ)
export interface CountryFact {
  fact: string;
  source: string;
}

// 国(くに)の事実(じじつ)データベース
export const nationsFacts: Record<string, CountryFact> = {
  // アジア地域(ちいき)
  japan: {
    fact: "世界(せかい)の6.0マグニチュード以上(いじょう)の地震(じしん)の20%が日本(にほん)で発生(はっせい)し、地震多発地帯(じしんたはつちたい)である環太平洋火山帯(かんたいへいようかざんたい)に位置(いち)している。",
    source: "https://www.express.co.uk/news/world/978227/Japan-earthquake-why-so-many-Osaka-stay-safe-earthquake"
  },

  china: {
    fact: "年間(ねんかん)6300万組(まんくみ)（1億(おく)2600万本(まんぼん)）の箸(はし)が製造(せいぞう)されており、使(つか)い捨(す)てから高品質(こうひんしつ)なものまで製造(せいぞう)に最大(さいだい)1ヶ月(かげつ)かかるものもある。",
    source: "https://www.worldometers.info/geography/how-many-countries-are-there-in-the-world/"
  },

  south_korea: {
    fact: "韓国(かんこく)では赤(あか)ちゃんが生(う)まれた時点(じてん)で自動的(じどうてき)に1歳(さい)とされ、新生児(しんせいじ)は韓国(かんこく)では1歳(さい)と考(かんが)えられている。",
    source: "https://www.90daykorean.com/interesting-facts-about-south-korea/"
  },

  mongolia: {
    fact: "モンゴルでは冬(ふゆ)に-30度(ど)の気温(きおん)でも街頭(がいとう)でアイスクリームが紙箱(かみばこ)から販売(はんばい)されており、冷凍庫(れいとうこ)が不要(ふよう)な冬(ふゆ)の人気(にんき)おやつとなっている。",
    source: "https://www.intrepidtravel.com/adventures/mongolia-facts/"
  },

  taiwan: {
    fact: "台湾(たいわん)は世界(せかい)で最(もっと)も山(やま)が多(おお)い島(しま)とされ、島(しま)の3分(ぶん)の2が山(やま)で覆(おお)われており、3000メートル以上(いじょう)の山(やま)が268座(ざ)もある。",
    source: "https://www.taiwanobsessed.com/taiwan-facts/"
  },

  india: {
    fact: "約(やく)2500年前(ねんまえ)にインドでサトウキビが初(はじ)めて化学的(かがくてき)に精製(せいせい)され、世界(せかい)に甘味(かんみ)への欲求(よっきゅう)をもたらした。",
    source: "https://theconversation.com/a-history-of-sugar-the-food-nobody-needs-but-everyone-craves-49823"
  },

  indonesia: {
    fact: "この東南(とうなん)アジアの国(くに)は世界最大(せかいさいだい)の島嶼国(とうしょこく)だが、正確(せいかく)にいくつの島(しま)があるかは誰(だれ)も知(し)らない（数千(すうせん)の島々(しまじま)）。",
    source: "https://www.farandwide.com/s/fascinating-facts-every-country-7c1f1a0efdf64979"
  },

  hong_kong: {
    fact: "香港(ほんこん)は1平方(へいほう)キロメートルあたりの億万長者数(おくまんちょうじゃすう)がニューヨーク、ドバイ、上海(しゃんはい)よりも多(おお)い。",
    source: "https://rusticpathways.com/blog/fun-facts-about-hong-kong"
  },

  // ヨーロッパ地域(ちいき)
  germany: {
    fact: "外国人(がいこくじん)を含(ふく)む全(すべ)ての人(ひと)が大学(だいがく)に無料(むりょう)で通(かよ)うことができる。",
    source: "https://www.bbc.com/news/magazine-32821678"
  },

  united_kingdom: {
    fact: "ウェールズは英国(えいこく)の一部(いちぶ)だが、ロアルド・ダール、キャサリン・ゼタ・ジョーンズ、アンソニー・ホプキンスなど驚(おどろ)くほど多(おお)くの有名人(ゆうめいじん)がウェールズ出身(しゅっしん)である。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  vatican: {
    fact: "バチカンを守(まも)る衛兵(えいへい)は19-30歳(さい)のスイス人男性(じんだんせい)で、身長(しんちょう)174cm以上(いじょう)でなければならず、制服(せいふく)の着用(ちゃくよう)が義務付(ぎむづ)けられている。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  russia: {
    fact: "ロシアは巨大(きょだい)で、国全体(くにぜんたい)を横断(おうだん)するシベリア横断鉄道(おうだんてつどう)は9300km以上(いじょう)の長(なが)さがあり、世界(せかい)で最(もっと)も長(なが)く最(もっと)も忙(いそが)しい鉄道路線(てつどうろせん)の一(ひと)つである。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  // 北米(ほくべい)地域(ちいき)
  usa: {
    fact: "現在(げんざい)の50星(ほし)の国旗(こっき)は1958年(ねん)に高校生(こうこうせい)がアラスカとハワイの加入(かにゅう)を見越(みこ)してクラスプロジェクトでデザインし、教師(きょうし)からB-の評価(ひょうか)を受(う)けた。",
    source: "https://www.thevintagenews.com/2018/10/08/the-50-star-american-flag/"
  },

  // 中南米(ちゅうなんべい)地域(ちいき)
  antigua_and_barbuda: {
    fact: "東(ひがし)カリブ海(かい)のこの比較的(ひかくてき)小(ちい)さな島(しま)には、世界(せかい)で最(もっと)も甘(あま)くて希少(きしょう)なパイナップルの品種(ひんしゅ)であるアンティグア・ブラックという甘(あま)い秘密(ひみつ)がある。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  belize: {
    fact: "多(おお)くの国(くに)がワインで知(し)られているが、ベリーズは伝統的(でんとうてき)なレシピに少(すこ)しひねりを加(くわ)え、カシューの木(き)の発酵(はっこう)した果実(かじつ)から作(つく)られるカシューワインを専門(せんもん)としている。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  chile: {
    fact: "世界初(せかいはつ)のジャガイモは一般的(いっぱんてき)にペルーで栽培(さいばい)されたと考(かんが)えられているが、現代(げんだい)のジャガイモ品種(ひんしゅ)の約(やく)99%は南(みなみ)チリ沖(おき)の小(ちい)さな島(しま)と遺伝的(いでんてき)に関連(かんれん)している。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  dominican_republic: {
    fact: "カリブ海最大(かいさいだい)で最(もっと)も多様(たよう)な島(しま)の一(ひと)つであるイスパニョーラ島(とう)に位置(いち)し、サント・ドミンゴのサンタ・マリア・ラ・メノール大聖堂(だいせいどう)は実際(じっさい)にアメリカ大陸最古(たいりくさいこ)の大聖堂(だいせいどう)である（1541年完成(ねんかんせい)）。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  haiti: {
    fact: "イスパニョーラ島(とう)の反対側(はんたいがわ)にあるハイチはしばしばブードゥー教(きょう)と関連付(かんれんづ)けられるが、「ブードゥー」は実際(じっさい)にはヴォドゥーとして知(し)られるハイチの宗教(しゅうきょう)の正確(せいかく)な描写(びょうしゃ)というよりも、米国(べいこく)のポップカルチャーの産物(さんぶつ)である。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  jamaica: {
    fact: "カリブ海(かい)の多(おお)くの英語圏(えいごけん)の島(しま)と同様(どうよう)に、ジャマイカはボクシングデーや新年(しんねん)にジャンカヌーとして知(し)られるカラフルなパレードで祝(いわ)い、興味深(きょうみぶか)いことに「ジャンカヌー！」はバハ・メンのアルバム名(めい)でもある。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  panama: {
    fact: "パナマ運河(うんが)は年間(ねんかん)20億(おく)ドル以上(いじょう)の船舶通行料(せんぱくつうこうりょう)を稼(かせ)いでおり、運河(うんが)を通過(つうか)する船舶(せんぱく)の平均通行料(へいきんつうこうりょう)は約(やく)15万(まん)ドルである。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  // アフリカ地域(ちいき)
  ghana: {
    fact: "ガーナは「戦士王(せんしおう)」を意味(いみ)し、西(にし)アフリカの黄金海岸(おうごんかいがん)に位置(いち)し、200万(まん)エーカー以上(いじょう)の表面積(ひょうめんせき)を持(も)つ世界最大(せかいさいだい)の人工湖(じんこうこ)ボルタ湖(こ)がある。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  lesotho: {
    fact: "南(みなみ)アフリカに完全(かんぜん)に囲(かこ)まれた内陸国(ないりくこく)レソトは、世界(せかい)で最(もっと)も高(たか)い最低地点(さいていちてん)を持(も)ち、国全体(くにぜんたい)の標高(ひょうこう)が1000m以上(いじょう)で「空(そら)の王国(おうこく)」と呼(よ)ばれている。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  madagascar: {
    fact: "マダガスカルには「ファマディハナ」という骨返(ほねがえ)しの儀式(ぎしき)があり、家族(かぞく)が祖先(そせん)を新(あたら)しい布(ぬの)で再埋葬(さいまいそう)し、故人(こじん)の名前(なまえ)を布(ぬの)に書(か)いて永遠(えいえん)に記憶(きおく)されるようにする。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  tanzania: {
    fact: "タンザニア沖(おき)のザンジバル島(とう)は世界最短(せかいさいたん)の戦争(せんそう)の舞台(ぶたい)で、1896年(ねん)の英(えい)ザンジバル戦争(せんそう)は約(やく)40分間(ふんかん)しか続(つづ)かなかった。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  uganda: {
    fact: "この中央(ちゅうおう)アフリカの国(くに)は、ウィンストン・チャーチルによって「アフリカの真珠(しんじゅ)」というニックネームを付(つ)けられ、1908年(ねん)に出版(しゅっぱん)された「My African Journey(アミアフリカンジャーニー)」で国(くに)とその多様性(たようせい)について愛情(あいじょう)を込(こ)めて書(か)いた。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  zimbabwe: {
    fact: "ジンバブエは1980年代(ねんだい)後期(こうき)から2017年(ねん)まで続(つづ)いた権威主義(けんいしゅぎ)政権(せいけん)により経済(けいざい)が混乱(こんらん)し、狂気(きょうき)のハイパーインフレーションが発生(はっせい)し、2009年(ねん)には100兆(ちょう)ドル紙幣(しへい)を印刷(いんさつ)していた。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  equatorial_guinea: {
    fact: "この中央(ちゅうおう)アフリカの国(くに)の人々(ひとびと)はエクアトギニア人(じん)と呼(よ)ばれ、公用語(こうようご)は意外(いがい)にもスペイン語(ご)である。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  // 中東(ちゅうとう)地域(ちいき)
  oman: {
    fact: "謙虚(けんきょ)なオマーン・スルタン国(こく)は実際(じっさい)にはアラブ世界(せかい)で最(もっと)も古(ふる)い独立国(どくりつこく)だが、さらに興味深(きょうみぶか)いことに、そこで最(もっと)も人気(にんき)のあるソフトドリンクはマウンテンデューである。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  qatar: {
    fact: "半島(はんとう)の上(うえ)の半島(はんとう)であるカタールは、世界(せかい)で最(もっと)も平坦(へいたん)な非島嶼国(ひとうしょこく)である。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  yemen: {
    fact: "アラビア半島(はんとう)のもう一(ひと)つの国(くに)であるイエメンは、悪名高(あくめいたか)いシバの女王(じょおう)の故郷(こきょう)と推定(すいてい)されている。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  // オセアニア地域(ちいき)
  fiji: {
    fact: "「フィジー」という名前(なまえ)は実際(じっさい)にはトンガ語(ご)での島(しま)の単語(たんご)/発音(はつおん)で、フィジー語(ご)では「ビティ」である。この誤称(ごしょう)は西洋(せいよう)の探検家(たんけんか)とフィジー人(じん)の最初(さいしょ)の出会(であ)いがトンガ島(とう)で行(おこな)われたために起(お)こった。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  // 中央(ちゅうおう)アジア地域(ちいき)
  kyrgyzstan: {
    fact: "キルギスタンには長(なが)い歴史(れきし)があり、世界最長(せかいさいちょう)の詩(し)の一(ひと)つである「マナス叙事詩(じょじし)」がある。この50万行(まんぎょう)以上(いじょう)の詩(し)は英雄(えいゆう)マナスとその多(おお)くの冒険(ぼうけん)を中心(ちゅうしん)としている。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  // 南(みなみ)アジア地域(ちいき)
  nepal: {
    fact: "ほとんどの人(ひと)がエベレスト山(さん)がネパールとチベット/中国(ちゅうごく)の国境(こっきょう)にあることを知(し)っているが、この悪名高(あくめいたか)い山(やま)のネパール名(めい)はサガルマータで、チベット語(ご)ではチョモランマとして知(し)られている。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  sri_lanka: {
    fact: "インドの涙滴(るいてき)と呼(よ)ばれるスリランカは茶(ちゃ)（セイロンはスリランカの旧名(きゅうめい)）で知(し)られているが、シナモンが最初(さいしょ)に栽培(さいばい)された場所(ばしょ)でもある。",
    source: "https://danifrancuzrose.com/2021/04/03/interesting-country-facts-a-z/"
  },

  // 特別(とくべつ)地域(ちいき)
  sealand: {
    fact: "シーランドは1967年(ねん)にパディ・ロイ・ベイツによってサフォーク沖(おき)の廃止(はいし)されたマンセル要塞(ようさい)に設立(せつりつ)され、1978年(ねん)にドイツとの交渉(こうしょう)を含(ふく)む外交(がいこう)事件(じけん)に関与(かんよ)している。",
    source: "https://en.wikipedia.org/wiki/List_of_micronations"
  },

  // 追加(ついか)の国々(くにぐに)（プレースホルダー）
  afghanistan: {
    fact: "アフガニスタンは「帝国(ていこく)の墓場(ぼじょう)」と呼(よ)ばれ、歴史上(れきしじょう)多(おお)くの大帝国(だいていこく)がこの地(ち)で苦戦(くせん)を強(し)いられてきた。",
    source: "https://example.com/afghanistan-facts"
  },

  albania: {
    fact: "アルバニアは世界(せかい)で唯一(ゆいいつ)、憲法(けんぽう)で無神論(むしんろん)国家(こっか)を宣言(せんげん)したことがある国(くに)である。",
    source: "https://example.com/albania-facts"
  },

  algeria: {
    fact: "アルジェリアはアフリカ最大(さいだい)の国(くに)で、国土(こくど)の80%以上(いじょう)がサハラ砂漠(さばく)に覆(おお)われている。",
    source: "https://example.com/algeria-facts"
  },

  andorra: {
    fact: "アンドラは世界(せかい)で唯一(ゆいいつ)、2人(ふたり)の外国人(がいこくじん)が共同(きょうどう)元首(げんしゅ)を務(つと)める国(くに)である（フランス大統領(だいとうりょう)とスペインの司教(しきょう)）。",
    source: "https://example.com/andorra-facts"
  },

  angola: {
    fact: "アンゴラは世界最大(せかいさいだい)のダイヤモンド産出国(さんしゅつこく)の一(ひと)つで、特(とく)に高品質(こうひんしつ)なピンクダイヤモンドで有名(ゆうめい)である。",
    source: "https://example.com/angola-facts"
  },

  argentina: {
    fact: "アルゼンチンは世界(せかい)で8番目(ばんめ)に大(おお)きな国(くに)で、タンゴの発祥地(はっしょうち)としても知(し)られている。",
    source: "https://example.com/argentina-facts"
  },

  armenia: {
    fact: "アルメニアは世界(せかい)で最初(さいしょ)にキリスト教(きょう)を国教(こっきょう)とした国(くに)である（301年(ねん)）。",
    source: "https://example.com/armenia-facts"
  },

  australia: {
    fact: "オーストラリアには世界(せかい)で最(もっと)も毒性(どくせい)の強(つよ)い動物(どうぶつ)が10種類(しゅるい)以上(いじょう)生息(せいそく)している。",
    source: "https://example.com/australia-facts"
  },

  austria: {
    fact: "オーストリアは世界(せかい)で最(もっと)も多(おお)くのノーベル賞(しょう)受賞者(じゅしょうしゃ)を輩出(はいしゅつ)した国(くに)の一(ひと)つである（人口比(じんこうひ)）。",
    source: "https://example.com/austria-facts"
  },

  azerbaijan: {
    fact: "アゼルバイジャンは「火(ひ)の国(くに)」と呼(よ)ばれ、天然(てんねん)ガスが自然(しぜん)発火(はっか)する現象(げんしょう)が見(み)られる。",
    source: "https://example.com/azerbaijan-facts"
  },

  bahamas: {
    fact: "バハマには世界(せかい)で唯一(ゆいいつ)、豚(ぶた)が泳(およ)ぐビーチがある。",
    source: "https://example.com/bahamas-facts"
  },

  bahrain: {
    fact: "バーレーンは世界(せかい)で最初(さいしょ)に石油(せきゆ)を発見(はっけん)した湾岸(わんがん)諸国(しょこく)である。",
    source: "https://example.com/bahrain-facts"
  },

  bangladesh: {
    fact: "バングラデシュは世界最大(せかいさいだい)のマングローブ林(りん)であるスンダルバンスの一部(いちぶ)を有(ゆう)している。",
    source: "https://example.com/bangladesh-facts"
  },

  barbados: {
    fact: "バルバドスはラム酒(しゅ)の発祥地(はっしょうち)とされ、世界最古(せかいさいこ)のラム酒(しゅ)蒸留所(じょうりゅうじょ)がある。",
    source: "https://example.com/barbados-facts"
  },

  belarus: {
    fact: "ベラルーシは世界(せかい)で最(もっと)も森林(しんりん)に覆(おお)われた国(くに)の一(ひと)つで、国土(こくど)の約(やく)40%が森林(しんりん)である。",
    source: "https://example.com/belarus-facts"
  },

  belgium: {
    fact: "ベルギーはチョコレートとワッフルで有名(ゆうめい)だが、フライドポテトの発明国(はつめいこく)でもある。",
    source: "https://example.com/belgium-facts"
  },

  benin: {
    fact: "ベナンはブードゥー教(きょう)の発祥地(はっしょうち)で、現在(げんざい)でも国民(こくみん)の多(おお)くがこの宗教(しゅうきょう)を信仰(しんこう)している。",
    source: "https://example.com/benin-facts"
  },

  bhutan: {
    fact: "ブータンは世界(せかい)で唯一(ゆいいつ)、国民総幸福量(こくみんそうこうふくりょう)（GNH(ジーエヌエイチ)）を国(くに)の発展指標(はってんしひょう)として採用(さいよう)している国(くに)である。",
    source: "https://example.com/bhutan-facts"
  },

  bolivia: {
    fact: "ボリビアには世界最大(せかいさいだい)の塩湖(えんこ)であるウユニ塩湖(えんこ)があり、雨季(うき)には巨大(きょだい)な鏡(かがみ)となる。",
    source: "https://example.com/bolivia-facts"
  },

  bosnia: {
    fact: "ボスニア・ヘルツェゴビナのサラエボは1984年冬季(ねんとうき)オリンピックの開催地(かいさいち)だった。",
    source: "https://example.com/bosnia-facts"
  },

  botswana: {
    fact: "ボツワナは世界最大(せかいさいだい)のダイヤモンド産出国(さんしゅつこく)で、経済(けいざい)の大部分(だいぶぶん)をダイヤモンド産業(さんぎょう)に依存(いぞん)している。",
    source: "https://example.com/botswana-facts"
  },

  brazil: {
    fact: "ブラジルはアマゾン熱帯雨林(ねったいうりん)の約(やく)60%を有(ゆう)し、世界(せかい)の酸素(さんそ)の20%を生産(せいさん)している。",
    source: "https://example.com/brazil-facts"
  },

  brunei: {
    fact: "ブルネイは世界(せかい)で最(もっと)も裕福(ゆうふく)な国(くに)の一(ひと)つで、国民(こくみん)は所得税(しょとくぜい)を支払(しはら)わず、医療(いりょう)と教育(きょういく)は無料(むりょう)で提供(ていきょう)されている。",
    source: "https://example.com/brunei-facts"
  },

  bulgaria: {
    fact: "ブルガリアはヨーグルトの発祥地(はっしょうち)で、ブルガリア菌(きん)（ラクトバチルス・ブルガリクス）の名前(なまえ)の由来(ゆらい)となっている。",
    source: "https://example.com/bulgaria-facts"
  },

  burkina_faso: {
    fact: "ブルキナファソは「誠実(せいじつ)な人々(ひとびと)の国(くに)」を意味(いみ)し、1984年(ねん)に現在(げんざい)の国名(こくめい)に変更(へんこう)された。",
    source: "https://example.com/burkina-faso-facts"
  },

  burundi: {
    fact: "ブルンジは世界(せかい)で最(もっと)も人口密度(じんこうみつど)の高(たか)い国(くに)の一(ひと)つで、コーヒー生産(せいさん)で有名(ゆうめい)である。",
    source: "https://example.com/burundi-facts"
  },

  cape_verde: {
    fact: "カーボベルデは10の火山島(かざんとう)からなる島国(しまぐに)で、独特(どくとく)のクレオール文化(ぶんか)を持(も)っている。",
    source: "https://example.com/cape-verde-facts"
  },

  cambodia: {
    fact: "カンボジアのアンコールワットは世界最大(せかいさいだい)の宗教建築物(しゅうきょうけんちくぶつ)である。",
    source: "https://example.com/cambodia-facts"
  },

  cameroon: {
    fact: "カメルーンは「アフリカの縮図(しゅくず)」と呼(よ)ばれ、アフリカ大陸(たいりく)の多様性(たようせい)を一国(いっこく)で体現(たいげん)している。",
    source: "https://example.com/cameroon-facts"
  },

  canada: {
    fact: "カナダは世界(せかい)で2番目(ばんめ)に大(おお)きな国(くに)で、世界(せかい)の淡水(たんすい)の20%を有(ゆう)している。",
    source: "https://example.com/canada-facts"
  },

  central_african: {
    fact: "中央(ちゅうおう)アフリカ共和国(きょうわこく)は世界(せかい)で最(もっと)も内陸(ないりく)に位置(いち)する国(くに)の一(ひと)つで、海(うみ)から最(もっと)も遠(とお)い地点(ちてん)がある。",
    source: "https://example.com/central-african-republic-facts"
  },

  chechnya: {
    fact: "チェチェンは北コーカサス地方(ほくこーかさすちほう)に位置(いち)し、複雑(ふくざつ)な歴史(れきし)と独自(どくじ)の文化(ぶんか)を持(も)ち、伝統的(でんとうてき)な山岳民族(さんがくみんぞく)として知(し)られている。",
    source: "https://example.com/chechnya-facts"
  },

  christiania: {
    fact: "クリスチャニアはデンマークのコペンハーゲン内(ない)にある自治(じち)コミュニティで、1971年(ねん)に軍事基地跡地(ぐんじきちあとち)に設立(せつりつ)され、独自(どくじ)の規則(きそく)と文化(ぶんか)を持(も)つ「フリータウン」として知(し)られている。",
    source: "https://example.com/christiania-facts"
  },

  chad: {
    fact: "チャドは世界(せかい)で最(もっと)も内陸(ないりく)に位置(いち)する国(くに)の一(ひと)つで、チャド湖(こ)は季節(きせつ)によって大(おお)きさが変(か)わる。",
    source: "https://example.com/chad-facts"
  },

  colombia: {
    fact: "コロンビアは世界最大(せかいさいだい)のエメラルド産出国(さんしゅつこく)で、世界(せかい)のエメラルドの70-90%を産出(さんしゅつ)している。",
    source: "https://example.com/colombia-facts"
  },

  conch_republic: {
    fact: "コンチ・リパブリックはフロリダ州(しゅう)キーウェストが1982年(ねん)に米国(べいこく)から「独立(どくりつ)」を宣言(せんげん)した冗談(じょうだん)の国家(こっか)で、「我々(われわれ)は戦(たたか)わないが降伏(こうふく)もしない」をモットーとし、観光(かんこう)と地元(じもと)のユーモアを象徴(しょうちょう)している。",
    source: "https://www.conchrepublic.com/history.htm"
  },

  cook_islands: {
    fact: "クック諸島(しょとう)はニュージーランドと自由連合(じゆうれんごう)の関係(かんけい)にある南太平洋(みなみたいへいよう)の15の島々(しまじま)からなり、マオリ文化(ぶんか)と美(うつく)しいラグーンで知(し)られている。",
    source: "https://example.com/cook-islands-facts"
  },

  curacao: {
    fact: "キュラソーはカリブ海(かい)に浮(う)かぶオランダ領(りょう)の島(しま)で、カラフルな建物(たてもの)が並(なら)ぶウィレムスタットの街並(まちな)みは世界遺産(せかいいさん)に登録(とうろく)されている。",
    source: "https://example.com/curacao-facts"
  },

  comoros: {
    fact: "コモロは「月(つき)の島々(しまじま)」を意味(いみ)し、イランイランの花(はな)の世界最大(せかいさいだい)の産出国(さんしゅつこく)である。",
    source: "https://example.com/comoros-facts"
  },

  congo: {
    fact: "コンゴ共和国(きょうわこく)はコンゴ川流域(がわりゅういき)に位置(いち)し、豊富(ほうふ)な石油資源(せきゆしげん)を有(ゆう)している。",
    source: "https://example.com/congo-facts"
  },

  costa_rica: {
    fact: "コスタリカは1948年(ねん)に軍隊(ぐんたい)を廃止(はいし)し、その予算(よさん)を教育(きょういく)と医療(いりょう)に回(まわ)している。",
    source: "https://example.com/costa-rica-facts"
  },

  ivory_coast: {
    fact: "コートジボワールは世界最大(せかいさいだい)のカカオ豆産出国(まめさんしゅつこく)で、世界(せかい)のチョコレートの約(やく)40%の原料(げんりょう)を供給(きょうきゅう)している。",
    source: "https://example.com/cote-divoire-facts"
  },

  croatia: {
    fact: "クロアチアはネクタイの発祥地(はっしょうち)で、17世紀(せいき)にクロアチア兵士(へいし)が着用(ちゃくよう)していたスカーフが起源(きげん)とされている。",
    source: "https://example.com/croatia-facts"
  },

  cuba: {
    fact: "キューバは世界最高品質(せかいさいこうひんしつ)の葉巻(はまき)の産地(さんち)として知(し)られ、独特(どくとく)の社会主義体制(しゃかいしゅぎたいせい)を維持(いじ)している。",
    source: "https://example.com/cuba-facts"
  },

  cyprus: {
    fact: "キプロスは地中海(ちちゅうかい)で3番目(ばんめ)に大(おお)きな島(しま)で、アフロディーテの生誕地(せいたんち)とされている。",
    source: "https://example.com/cyprus-facts"
  },

  czech_republic: {
    fact: "チェコ共和国(きょうわこく)は世界(せかい)で最(もっと)もビールを消費(しょうひ)する国(くに)で、ピルスナービールの発祥地(はっしょうち)でもある。",
    source: "https://example.com/czech-republic-facts"
  },

  east_timor: {
    fact: "東ティモール(ひがしてぃもーる)は21世紀(せいき)に独立(どくりつ)した最初(さいしょ)の国(くに)で、2002年(ねん)5月(がつ)20日(にち)に独立(どくりつ)を果(は)たした。",
    source: "https://example.com/east-timor-facts"
  },

  faroe: {
    fact: "フェロー諸島(しょとう)はデンマーク王国(おうこく)の自治領(じちりょう)で、北大西洋(きたたいせいよう)に位置(いち)し、羊(ひつじ)の数(かず)が人口(じんこう)より多(おお)い。",
    source: "https://example.com/faroe-islands-facts"
  },

  congo_dem: {
    fact: "コンゴ民主共和国(みんしゅきょうわこく)は世界最大(せかいさいだい)のコバルト産出国(さんしゅつこく)で、スマートフォン(すまーとふぉん)のバッテリー(ばってりー)に不可欠(ふかけつ)な鉱物(こうぶつ)を供給(きょうきゅう)している。",
    source: "https://example.com/drc-facts"
  },

  denmark: {
    fact: "デンマークは世界(せかい)で最(もっと)も幸福(こうふく)な国(くに)の一(ひと)つとされ、レゴブロックの発祥地(はっしょうち)でもある。",
    source: "https://example.com/denmark-facts"
  },

  djibouti: {
    fact: "ジブチは世界(せかい)で最(もっと)も暑(あつ)い国(くに)の一(ひと)つで、アフリカの角(つの)と呼(よ)ばれる戦略的要衝(せんりゃくできようしょう)に位置(いち)している。",
    source: "https://example.com/djibouti-facts"
  },

  dominica: {
    fact: "ドミニカ国(こく)は「カリブ海(かい)の自然(しぜん)の島(しま)」と呼(よ)ばれ、365の川(かわ)がある。",
    source: "https://example.com/dominica-facts"
  },

  ecuador: {
    fact: "エクアドルはガラパゴス諸島(しょとう)を有(ゆう)し、ダーウィン(だーうぃん)の進化論(しんかろん)の着想地(ちゃくそうち)として有名(ゆうめい)である。",
    source: "https://example.com/ecuador-facts"
  },

  egypt: {
    fact: "エジプトには世界最古(せかいさいこ)の文明(ぶんめい)の一(ひと)つがあり、ピラミッド(ぴらみっど)とスフィンクス(すふぃんくす)で有名(ゆうめい)である。",
    source: "https://example.com/egypt-facts"
  },

  el_salvador: {
    fact: "エルサルバドルは中米(ちゅうべい)で最(もっと)も小(ちい)さな国(くに)だが、最(もっと)も人口密度(じんこうみつど)が高(たか)い国(くに)でもある。",
    source: "https://example.com/el-salvador-facts"
  },

  eritrea: {
    fact: "エリトリアは世界(せかい)で最(もっと)も若(わか)い国(くに)の一(ひと)つで、1993年(ねん)にエチオピアから独立(どくりつ)した。",
    source: "https://example.com/eritrea-facts"
  },

  estonia: {
    fact: "エストニアは世界(せかい)で最(もっと)もデジタル化(でじたるか)が進(すす)んだ国(くに)の一(ひと)つで、Skype(すかいぷ)の発祥地(はっしょうち)でもある。",
    source: "https://example.com/estonia-facts"
  },

  eswatini: {
    fact: "エスワティニ（旧(きゅう)スワジランド）は世界最後(せかいさいご)の絶対君主制(ぜったいくんしゅせい)の一(ひと)つで、王(おう)が直接統治(ちょくせつとうち)している。",
    source: "https://example.com/eswatini-facts"
  },

  ethiopia: {
    fact: "エチオピアは独自(どくじ)の暦(こよみ)を使用(しよう)しており、1年(ねん)が13ヶ月(かげつ)ある。",
    source: "https://example.com/ethiopia-facts"
  },

  finland: {
    fact: "フィンランドはサウナ(さうな)の発祥地(はっしょうち)で、人口(じんこう)よりもサウナ(さうな)の数(かず)が多(おお)い。",
    source: "https://example.com/finland-facts"
  },

  france: {
    fact: "フランスは世界(せかい)で最(もっと)も観光客(かんこうきゃく)が多(おお)い国(くに)で、年間(ねんかん)約(やく)9000万人(まんにん)の観光客(かんこうきゃく)が訪(おとず)れる。",
    source: "https://example.com/france-facts"
  },

  gabon: {
    fact: "ガボンは国土(こくど)の85%が熱帯雨林(ねったいうりん)に覆(おお)われており、豊富(ほうふ)な石油資源(せきゆしげん)を有(ゆう)している。",
    source: "https://example.com/gabon-facts"
  },

  guam: {
    fact: "グアムはアメリカ合衆国(がっしゅうこく)の準州(じゅんしゅう)で、太平洋(たいへいよう)に位置(いち)するマリアナ諸島(しょとう)の最大(さいだい)の島(しま)であり、第二次世界大戦(だいにじせかいたいせん)の重要(じゅうよう)な戦場(せんじょう)となった場所(ばしょ)である。",
    source: "https://example.com/guam-facts"
  },

  gambia: {
    fact: "ガンビアはアフリカ大陸(たいりく)で最(もっと)も小(ちい)さな国(くに)で、ガンビア川(がわ)に沿(そ)って細長(ほそなが)く伸(の)びている。",
    source: "https://example.com/gambia-facts"
  },

  georgia: {
    fact: "ジョージアはワイン(わいん)発祥(はっしょう)の地(ち)とされ、8000年前(ねんまえ)からワイン(わいん)造(づく)りが行(おこな)われている。",
    source: "https://example.com/georgia-facts"
  },

  greece: {
    fact: "ギリシャは西洋文明(せいようぶんめい)の発祥地(はっしょうち)で、民主主義(みんしゅしゅぎ)とオリンピック(おりんぴっく)の起源(きげん)である。",
    source: "https://example.com/greece-facts"
  },

  grenada: {
    fact: "グレナダは「スパイス(すぱいす)の島(しま)」と呼(よ)ばれ、世界(せかい)のナツメグ(なつめぐ)の約(やく)20%を生産(せいさん)している。",
    source: "https://example.com/grenada-facts"
  },

  guatemala: {
    fact: "グアテマラは古代(こだい)マヤ文明(ぶんめい)の中心地(ちゅうしんち)で、現在(げんざい)でも多(おお)くのマヤ遺跡(いせき)が残(のこ)っている。",
    source: "https://example.com/guatemala-facts"
  },

  guinea: {
    fact: "ギニアは世界最大(せかいさいだい)のボーキサイト(ぼーきさいと)（アルミニウム(あるみにうむ)の原料(げんりょう)）埋蔵量(まいぞうりょう)を有(ゆう)している。",
    source: "https://example.com/guinea-facts"
  },

  guinea_bissau: {
    fact: "ギニアビサウは世界最大(せかいさいだい)のカシューナッツ(かしゅーなっつ)産出国(さんしゅつこく)の一(ひと)つである。",
    source: "https://example.com/guinea-bissau-facts"
  },

  guyana: {
    fact: "ガイアナは南米(なんべい)で唯一(ゆいいつ)英語(えいご)を公用語(こうようご)とする国(くに)で、豊富(ほうふ)な金(きん)とダイヤモンド(だいやもんど)を産出(さんしゅつ)している。",
    source: "https://example.com/guyana-facts"
  },

  honduras: {
    fact: "ホンジュラスは古代(こだい)マヤ文明(ぶんめい)のコパン遺跡(いせき)で有名(ゆうめい)で、「バナナ共和国(きょうわこく)」という言葉(ことば)の語源(ごげん)となった国(くに)の一(ひと)つである。",
    source: "https://example.com/honduras-facts"
  },

  hungary: {
    fact: "ハンガリーはルービックキューブ(るーびっくきゅーぶ)の発明国(はつめいこく)で、独特(どくとく)のマジャール語(ご)を使用(しよう)している。",
    source: "https://example.com/hungary-facts"
  },

  hutt_river: {
    fact: "ハットリバー公国(こうこく)はオーストラリア西部(せいぶ)の農場主(のうじょうぬし)レナード・ケイスリーが1970年(ねん)に独立(どくりつ)を宣言(せんげん)した自称(じしょう)の微小国家(びしょうこっか)で、2020年(ねん)に解散(かいさん)するまで独自(どくじ)の通貨(つうか)や切手(きって)を発行(はっこう)していた。",
    source: "https://example.com/hutt-river-facts"
  },

  iceland: {
    fact: "アイスランドは世界(せかい)で最(もっと)も平和(へいわ)な国(くに)とされ、軍隊(ぐんたい)を持(も)たない国(くに)の一(ひと)つである。",
    source: "https://example.com/iceland-facts"
  },

  iran: {
    fact: "イランは世界最古(せかいさいこ)の文明(ぶんめい)の一(ひと)つペルシア帝国(ていこく)の後継国(こうけいこく)で、豊富(ほうふ)な石油(せきゆ)と天然(てんねん)ガスを有(ゆう)している。",
    source: "https://example.com/iran-facts"
  },

  iraq: {
    fact: "イラクは古代(こだい)メソポタミア文明(ぶんめい)の発祥地(はっしょうち)で、「文明(ぶんめい)のゆりかご」と呼(よ)ばれている。",
    source: "https://example.com/iraq-facts"
  },

  ireland: {
    fact: "アイルランドはシャムロック(しゃむろっく)（三(み)つ葉(ば)のクローバー(くろーばー)）の国(くに)で、聖(せい)パトリックの日(ひ)の発祥地(はっしょうち)である。",
    source: "https://example.com/ireland-facts"
  },

  israel: {
    fact: "イスラエルは砂漠(さばく)の国(くに)でありながら、革新的(かくしんてき)な農業技術(のうぎょうぎじゅつ)により食料自給(しょくりょうじきゅう)を達成(たっせい)している。",
    source: "https://example.com/israel-facts"
  },

  italy: {
    fact: "イタリアは世界(せかい)で最(もっと)も多(おお)くの世界遺産(せかいいさん)を有(ゆう)する国(くに)で、ピザ(ぴざ)とパスタ(ぱすた)の発祥地(はっしょうち)である。",
    source: "https://example.com/italy-facts"
  },

  jordan: {
    fact: "ヨルダンには古代都市(こだいとし)ペトラ(ぺとら)があり、「バラ色(ばらいろ)の都市(とし)」として知(し)られている。",
    source: "https://example.com/jordan-facts"
  },

  kazakhstan: {
    fact: "カザフスタンは世界最大(せかいさいだい)の内陸国(ないりくこく)で、世界(せかい)のウラン(うらん)産出量(さんしゅつりょう)の約(やく)40%を占(し)めている。",
    source: "https://example.com/kazakhstan-facts"
  },

  kenya: {
    fact: "ケニアは人類発祥(じんるいはっしょう)の地(ち)の一(ひと)つとされ、多(おお)くの初期人類(しょきじんるい)の化石(かせき)が発見(はっけん)されている。",
    source: "https://example.com/kenya-facts"
  },

  kiribati: {
    fact: "キリバスは世界(せかい)で最初(さいしょ)に新年(しんねん)を迎(むか)える国(くに)の一(ひと)つで、33の環礁(かんしょう)からなる。",
    source: "https://example.com/kiribati-facts"
  },

  kuwait: {
    fact: "クウェートは世界(せかい)で最(もっと)も豊(ゆた)かな国(くに)の一(ひと)つで、石油収入(せきゆしゅうにゅう)により国民(こくみん)に多(おお)くの福利厚生(ふくりこうせい)を提供(ていきょう)している。",
    source: "https://example.com/kuwait-facts"
  },

  kosovo: {
    fact: "コソボはヨーロッパ(よーろっぱ)で最(もっと)も新(あたら)しい国(くに)の一(ひと)つで、2008年(ねん)に独立(どくりつ)を宣言(せんげん)し、多(おお)くの国(くに)に承認(しょうにん)されているが、セルビアは依然(いぜん)として自国(じこく)の一部(いちぶ)と主張(しゅちょう)している。",
    source: "https://example.com/kosovo-facts"
  },

  laos: {
    fact: "ラオスは東南(とうなん)アジアで唯一(ゆいいつ)の内陸国(ないりくこく)で、メコン川(がわ)が国土(こくど)を流(なが)れている。",
    source: "https://example.com/laos-facts"
  },

  latvia: {
    fact: "ラトビアはバルト三国(さんごく)の一(ひと)つで、美(うつく)しい中世(ちゅうせい)の建築(けんちく)と豊(ゆた)かな森林(しんりん)で知(し)られている。",
    source: "https://example.com/latvia-facts"
  },

  lebanon: {
    fact: "レバノンは古代(こだい)フェニキア人(じん)の故郷(こきょう)で、アルファベット(あるふぁべっと)の起源(きげん)となった文字(もじ)を発明(はつめい)した。",
    source: "https://example.com/lebanon-facts"
  },

  liberia: {
    fact: "リベリアはアフリカで最初(さいしょ)の共和国(きょうわこく)で、解放(かいほう)された奴隷(どれい)によって建国(けんこく)された。",
    source: "https://example.com/liberia-facts"
  },

  libya: {
    fact: "リビアは世界最大(せかいさいだい)の石油埋蔵量(せきゆまいぞうりょう)を有(ゆう)する国(くに)の一(ひと)つで、サハラ砂漠(さばく)の大部分(だいぶぶん)を占(し)めている。",
    source: "https://example.com/libya-facts"
  },

  liechtenstein: {
    fact: "リヒテンシュタインは世界(せかい)で6番目(ばんめ)に小(ちい)さな国(くに)で、歯(は)の入(い)れ歯(ば)製造(せいぞう)で世界的(せかいてき)に有名(ゆうめい)である。",
    source: "https://example.com/liechtenstein-facts"
  },

  lithuania: {
    fact: "リトアニアはバルト三国(さんごく)で最大(さいだい)の国(くに)で、1990年(ねん)にソ連(それん)から独立(どくりつ)を宣言(せんげん)した最初(さいしょ)の共和国(きょうわこく)である。",
    source: "https://example.com/lithuania-facts"
  },

  luxembourg: {
    fact: "ルクセンブルクは世界(せかい)で最(もっと)も豊(ゆた)かな国(くに)の一(ひと)つで、多(おお)くの国際機関(こくさいきかん)の本部(ほんぶ)がある。",
    source: "https://example.com/luxembourg-facts"
  },

  malaysia: {
    fact: "マレーシアは世界最大(せかいさいだい)のパーム油(ゆ)産出国(さんしゅつこく)で、ペトロナスツインタワー(ぺとろなすついんたわー)で有名(ゆうめい)である。",
    source: "https://example.com/malaysia-facts"
  },

  maldives: {
    fact: "モルディブは世界(せかい)で最(もっと)も低(ひく)い国(くに)で、平均海抜(へいきんかいばつ)が1.5メートルしかない。",
    source: "https://example.com/maldives-facts"
  },

  mali: {
    fact: "マリは古代(こだい)の金(きん)の交易(こうえき)で栄(さか)えた国(くに)で、トンブクトゥの古代都市(こだいとし)で有名(ゆうめい)である。",
    source: "https://example.com/mali-facts"
  },

  malta: {
    fact: "マルタは地中海(ちちゅうかい)の小(ちい)さな島国(しまぐに)で、世界(せかい)で最(もっと)も人口密度(じんこうみつど)の高(たか)い国(くに)の一(ひと)つである。",
    source: "https://example.com/malta-facts"
  },

  marshall_islands: {
    fact: "マーシャル諸島(しょとう)は第二次世界大戦中(だいにじせかいたいせんちゅう)の激戦地(げきせんち)で、現在(げんざい)は気候変動(きこうへんどう)の影響(えいきょう)を最(もっと)も受(う)けやすい国(くに)の一(ひと)つである。",
    source: "https://example.com/marshall-islands-facts"
  },

  mauritania: {
    fact: "モーリタニアはサハラ砂漠(さばく)の大部分(だいぶぶん)を占(し)める国(くに)で、世界最後(せかいさいご)に奴隷制(どれいせい)を廃止(はいし)した国(くに)である（1981年(ねん)）。",
    source: "https://example.com/mauritania-facts"
  },

  mauritius: {
    fact: "モーリシャスは絶滅(ぜつめつ)したドードー鳥(ちょう)の故郷(こきょう)で、多民族(たみんぞく)・多文化社会(たぶんかしゃかい)として知(し)られている。",
    source: "https://example.com/mauritius-facts"
  },

  mexico: {
    fact: "メキシコはチョコレート(ちょこれーと)、トマト(とまと)、トウモロコシ(とうもろこし)の原産地(げんさんち)で、古代(こだい)アステカ(あすてか)・マヤ文明(ぶんめい)の遺産(いさん)を持(も)つ。",
    source: "https://example.com/mexico-facts"
  },

  micronesia: {
    fact: "ミクロネシアは607の島(しま)からなる国(くに)で、第二次世界大戦(だいにじせかいたいせん)の戦跡(せんせき)が多(おお)く残(のこ)っている。",
    source: "https://example.com/micronesia-facts"
  },

  french_polynesia: {
    fact: "フランス領(りょう)ポリネシアは118の島(しま)と環礁(かんしょう)からなり、タヒチ(たひち)を含(ふく)む5つの群島(ぐんとう)で構成(こうせい)され、透明(とうめい)な青(あお)いラグーン(らぐーん)と豊(ゆた)かなサンゴ礁(しょう)で有名(ゆうめい)である。",
    source: "https://example.com/french-polynesia-facts"
  },

  moldova: {
    fact: "モルドバは世界最大(せかいさいだい)のワインセラー(わいんせらー)を有(ゆう)し、地下都市(ちかとし)のような巨大(きょだい)なワイン貯蔵庫(ちょぞうこ)がある。",
    source: "https://example.com/moldova-facts"
  },

  monaco: {
    fact: "モナコは世界(せかい)で2番目(ばんめ)に小(ちい)さな国(くに)で、世界(せかい)で最(もっと)も人口密度(じんこうみつど)が高(たか)い国(くに)である。",
    source: "https://example.com/monaco-facts"
  },

  montenegro: {
    fact: "モンテネグロは「黒(くろ)い山(やま)」を意味(いみ)し、バルカン半島(はんとう)の美(うつく)しい山岳地帯(さんがくちたい)にある。",
    source: "https://example.com/montenegro-facts"
  },

  morocco: {
    fact: "モロッコは世界最大(せかいさいだい)のリン鉱石(こうせき)産出国(さんしゅつこく)で、サハラ砂漠(さばく)とアトラス山脈(さんみゃく)を有(ゆう)している。",
    source: "https://example.com/morocco-facts"
  },

  mozambique: {
    fact: "モザンビークは世界(せかい)で唯一(ゆいいつ)、国旗(こっき)にAK-47(エーケーよんじゅうなな)自動小銃(じどうしょうじゅう)が描(えが)かれている国(くに)である。",
    source: "https://example.com/mozambique-facts"
  },

  myanmar: {
    fact: "ミャンマーは世界最大(せかいさいだい)の仏教国(ぶっきょうこく)の一(ひと)つで、バガンには2000以上(いじょう)の古代仏塔(こだいぶっとう)が残(のこ)っている。",
    source: "https://example.com/myanmar-facts"
  },

  namibia: {
    fact: "ナミビアは世界最古(せかいさいこ)の砂漠(さばく)であるナミブ砂漠(さばく)を有(ゆう)し、ダイヤモンド(だいやもんど)の産地(さんち)として有名(ゆうめい)である。",
    source: "https://example.com/namibia-facts"
  },

  nauru: {
    fact: "ナウルは世界(せかい)で3番目(ばんめ)に小(ちい)さな国(くに)で、かつてリン鉱石(こうせき)の採掘(さいくつ)で世界一(せかいいち)豊(ゆた)かな国(くに)だった。",
    source: "https://example.com/nauru-facts"
  },

  netherlands: {
    fact: "オランダは国土(こくど)の約(やく)26%が海面下(かいめんか)にあり、風車(ふうしゃ)とチューリップ(ちゅーりっぷ)で有名(ゆうめい)である。",
    source: "https://example.com/netherlands-facts"
  },

  new_zealand: {
    fact: "ニュージーランドは世界(せかい)で最初(さいしょ)に女性参政権(じょせいさんせいけん)を認(みと)めた国(くに)で、映画(えいが)「ロード・オブ・ザ・リング(ろーど・おぶ・ざ・りんぐ)」の撮影地(さつえいち)である。",
    source: "https://example.com/new-zealand-facts"
  },

  nicaragua: {
    fact: "ニカラグアは中米最大(ちゅうべいさいだい)の国(くに)で、多(おお)くの活火山(かっかざん)と美(うつく)しい湖(みずうみ)で知(し)られている。",
    source: "https://example.com/nicaragua-facts"
  },

  niger: {
    fact: "ニジェールは世界最大(せかいさいだい)のウラン産出国(さんしゅつこく)の一(ひと)つで、サハラ砂漠(さばく)の南端(なんたん)に位置(いち)している。",
    source: "https://example.com/niger-facts"
  },

  nigeria: {
    fact: "ナイジェリアはアフリカで最(もっと)も人口(じんこう)の多(おお)い国(くに)で、世界最大(せかいさいだい)の石油産出国(せきゆさんしゅつこく)の一(ひと)つである。",
    source: "https://example.com/nigeria-facts"
  },

  north_korea: {
    fact: "北朝鮮(きたちょうせん)は世界(せかい)で最(もっと)も孤立(こりつ)した国(くに)の一(ひと)つで、独自(どくじ)の主体思想(しゅたいしそう)に基(もと)づく社会主義体制(しゃかいしゅぎたいせい)を維持(いじ)している。",
    source: "https://example.com/north-korea-facts"
  },

  north_macedonia: {
    fact: "北(きた)マケドニアは古代(こだい)マケドニア王国(おうこく)の一部(いちぶ)で、アレクサンダー大王(だいおう)の故郷(こきょう)とされている。",
    source: "https://example.com/north-macedonia-facts"
  },

  norway: {
    fact: "ノルウェーは世界最大(せかいさいだい)の石油基金(せきゆききん)を有(ゆう)し、フィヨルド(ふぃよるど)とオーロラ(おーろら)で有名(ゆうめい)である。",
    source: "https://example.com/norway-facts"
  },

  pakistan: {
    fact: "パキスタンは世界(せかい)で2番目(ばんめ)に多(おお)いイスラム教徒人口(きょうとじんこう)を有(ゆう)し、K2(ケーツー)（世界第(せかいだい)2位(い)の高峰(こうほう)）がある。",
    source: "https://example.com/pakistan-facts"
  },

  palau: {
    fact: "パラオは世界初(せかいはつ)のサメ保護区(ほごく)を設立(せつりつ)し、美(うつく)しいサンゴ礁(さんごしょう)とジェリーフィッシュレイク(じぇりーふぃっしゅれいく)で有名(ゆうめい)である。",
    source: "https://example.com/palau-facts"
  },

  palestine: {
    fact: "パレスチナは世界最古(せかいさいこ)の都市(とし)の一(ひと)つエリコがあり、オリーブオイル(おりーぶおいる)の産地(さんち)として知(し)られている。",
    source: "https://example.com/palestine-facts"
  },

  papua_new_guinea: {
    fact: "パプアニューギニアは世界(せかい)で最(もっと)も言語(げんご)の多様性(たようせい)が高(たか)い国(くに)で、800以上(いじょう)の言語(げんご)が話(はな)されている。",
    source: "https://example.com/papua-new-guinea-facts"
  },

  paraguay: {
    fact: "パラグアイは南米(なんべい)で唯一(ゆいいつ)の内陸国(ないりくこく)の一(ひと)つで、グアラニー語(ご)とスペイン語(ご)が公用語(こうようご)である。",
    source: "https://example.com/paraguay-facts"
  },

  peru: {
    fact: "ペルーは古代(こだい)インカ帝国(ていこく)の中心地(ちゅうしんち)で、マチュピチュ(まちゅぴちゅ)とナスカの地上絵(ちじょうえ)で有名(ゆうめい)である。",
    source: "https://example.com/peru-facts"
  },

  philippines: {
    fact: "フィリピンは7641の島(しま)からなる群島国家(ぐんとうこっか)で、世界(せかい)で3番目(ばんめ)に多(おお)い英語話者人口(えいごわしゃじんこう)を有(ゆう)している。",
    source: "https://example.com/philippines-facts"
  },

  poland: {
    fact: "ポーランドはコペルニクス(こぺるにくす)とキュリー夫人(ふじん)の故郷(こきょう)で、ヨーロッパ最大(さいだい)のバイソン(ばいそん)の群(む)れがある。",
    source: "https://example.com/poland-facts"
  },

  portugal: {
    fact: "ポルトガルは大航海時代(だいこうかいじだい)の先駆者(せんくしゃ)で、世界(せかい)で最(もっと)も古(ふる)い書店(しょてん)がリスボン(りすぼん)にある。",
    source: "https://example.com/portugal-facts"
  },

  romania: {
    fact: "ルーマニアはドラキュラ伝説(でんせつ)の舞台(ぶたい)で、世界(せかい)で2番目(ばんめ)に大(おお)きな建物(たてもの)である国民(こくみん)の館(やかた)がある。",
    source: "https://example.com/romania-facts"
  },

  rwanda: {
    fact: "ルワンダは「千(せん)の丘(おか)の国(くに)」と呼(よ)ばれ、世界(せかい)で最(もっと)も女性議員(じょせいぎいん)の割合(わりあい)が高(たか)い国(くに)である。",
    source: "https://example.com/rwanda-facts"
  },

  saint_kitts_and_nevis: {
    fact: "セントクリストファー・ネイビスは西半球(にしはんきゅう)で最(もっと)も小(ちい)さな国(くに)で、砂糖産業(さとうさんぎょう)で栄(さか)えた歴史(れきし)がある。",
    source: "https://example.com/saint-kitts-and-nevis-facts"
  },

  saint_lucia: {
    fact: "セントルシアは世界(せかい)で唯一(ゆいいつ)、ノーベル文学賞受賞者(ぶんがくしょうじゅしょうしゃ)を2人輩出(ふたりはいしゅつ)した国(くに)である（人口比(じんこうひ)）。",
    source: "https://example.com/saint-lucia-facts"
  },

  saint_vincent_and_the_grenadines: {
    fact: "セントビンセント及(およ)びグレナディーン諸島(しょとう)は32の島(しま)からなり、映画(えいが)「パイレーツ・オブ・カリビアン(ぱいれーつ・おぶ・かりびあん)」の撮影地(さつえいち)である。",
    source: "https://example.com/saint-vincent-and-the-grenadines-facts"
  },

  samoa: {
    fact: "サモアは世界(せかい)で最初(さいしょ)に新年(しんねん)を迎(むか)える国(くに)の一(ひと)つで、2011年(ねん)に日付変更線(ひづけへんこうせん)を移動(いどう)した。",
    source: "https://example.com/samoa-facts"
  },

  american_samoa: {
    fact: "アメリカ領(りょう)サモアは南太平洋(みなみたいへいよう)に位置(いち)する米国(べいこく)の海外領土(かいがいりょうど)で、伝統的(でんとうてき)なサモア文化(ぶんか)と美(うつく)しいサンゴ礁(しょう)で知(し)られている。",
    source: "https://example.com/american-samoa-facts"
  },

  san_marino: {
    fact: "サンマリノは世界(せかい)で5番目(ばんめ)に小(ちい)さな国(くに)で、世界最古(せかいさいこ)の共和国(きょうわこく)とされている。",
    source: "https://example.com/san-marino-facts"
  },

  sao_tome_and_principe: {
    fact: "サントメ・プリンシペは世界(せかい)で2番目(ばんめ)に小(ちい)さなアフリカの国(くに)で、カカオの産地(さんち)として有名(ゆうめい)である。",
    source: "https://example.com/sao-tome-and-principe-facts"
  },

  saudi_arabia: {
    fact: "サウジアラビアは世界最大(せかいさいだい)の石油埋蔵量(せきゆまいぞうりょう)を有(ゆう)し、イスラム教(きょう)の聖地(せいち)メッカとメディナがある。",
    source: "https://example.com/saudi-arabia-facts"
  },

  senegal: {
    fact: "セネガルは西(にし)アフリカの民主主義(みんしゅしゅぎ)の模範国(もはんこく)とされ、テランガ（もてなし）の文化(ぶんか)で有名(ゆうめい)である。",
    source: "https://example.com/senegal-facts"
  },

  serbia: {
    fact: "セルビアはヨーロッパで最(もっと)も多(おお)くのラズベリー(らずべりー)を生産(せいさん)する国(くに)で、ノバク・ジョコビッチ(のばく・じょこびっち)の故郷(こきょう)である。",
    source: "https://example.com/serbia-facts"
  },

  seychelles: {
    fact: "セーシェルは世界(せかい)で最(もっと)も小(ちい)さなアフリカの国(くに)で、ココ・デ・メール(ここ・で・めーる)という巨大(きょだい)な種子(しゅし)で有名(ゆうめい)である。",
    source: "https://example.com/seychelles-facts"
  },

  sierra_leone: {
    fact: "シエラレオネは世界最大(せかいさいだい)のダイヤモンド(だいやもんど)の一(ひと)つが発見(はっけん)された国(くに)で、美(うつく)しい海岸線(かいがんせん)を持(も)つ。",
    source: "https://example.com/sierra-leone-facts"
  },

  singapore: {
    fact: "シンガポールは世界(せかい)で唯一(ゆいいつ)の島嶼都市国家(とうしょとしこっか)で、チューインガム(ちゅーいんがむ)の販売(はんばい)が禁止(きんし)されている。",
    source: "https://example.com/singapore-facts"
  },

  slovakia: {
    fact: "スロバキアは世界(せかい)で最(もっと)も城(しろ)の密度(みつど)が高(たか)い国(くに)で、美(うつく)しいカルパティア山脈(さんみゃく)がある。",
    source: "https://example.com/slovakia-facts"
  },

  slovenia: {
    fact: "スロベニアは世界(せかい)で最(もっと)も森林(しんりん)に覆(おお)われた国(くに)の一(ひと)つで、美(うつく)しいブレッド湖(こ)で有名(ゆうめい)である。",
    source: "https://example.com/slovenia-facts"
  },

  solomon_islands: {
    fact: "ソロモン諸島(しょとう)は第二次世界大戦(だいにじせかいたいせん)の激戦地(げきせんち)で、992の島(しま)からなる美(うつく)しい群島国家(ぐんとうこっか)である。",
    source: "https://example.com/solomon-islands-facts"
  },

  somalia: {
    fact: "ソマリアはアフリカの角(つの)に位置(いち)し、世界最長(せかいさいちょう)の海岸線(かいがんせん)を持(も)つアフリカの国(くに)である。",
    source: "https://example.com/somalia-facts"
  },

  somaliland: {
    fact: "ソマリランドは国際的(こくさいてき)に広(ひろ)く承認(しょうにん)されていない事実上(じじつじょう)の独立国家(どくりつこっか)で、ソマリアの一部(いちぶ)とされているが、独自(どくじ)の政府(せいふ)、通貨(つうか)、軍隊(ぐんたい)を持(も)っている。",
    source: "https://example.com/somaliland-facts"
  },

  south_africa: {
    fact: "南(みなみ)アフリカは世界(せかい)で唯一(ゆいいつ)、核兵器(かくへいき)を自主的(じしゅてき)に廃棄(はいき)した国(くに)で、11の公用語(こうようご)を持(も)つ。",
    source: "https://example.com/south-africa-facts"
  },

  south_sudan: {
    fact: "南(みなみ)スーダンは世界(せかい)で最(もっと)も新(あたら)しい国(くに)で、2011年(ねん)にスーダンから独立(どくりつ)した。",
    source: "https://example.com/south-sudan-facts"
  },

  spain: {
    fact: "スペインは世界(せかい)で3番目(ばんめ)に多(おお)くの世界遺産(せかいいさん)を有(ゆう)し、フラメンコ(ふらめんこ)とパエリア(ぱえりあ)の発祥地(はっしょうち)である。",
    source: "https://example.com/spain-facts"
  },

  sudan: {
    fact: "スーダンは古代(こだい)ヌビア王国(おうこく)の中心地(ちゅうしんち)で、ナイル川(がわ)の青(あお)ナイルと白(しろ)ナイルが合流(ごうりゅう)する地点(ちてん)がある。",
    source: "https://example.com/sudan-facts"
  },

  suriname: {
    fact: "スリナムは南米(なんべい)で最(もっと)も小(ちい)さな国(くに)で、熱帯雨林(ねったいうりん)が国土(こくど)の80%以上(いじょう)を占(し)めている。",
    source: "https://example.com/suriname-facts"
  },

  sweden: {
    fact: "スウェーデンはノーベル賞(しょう)の故郷(こきょう)で、世界(せかい)で最(もっと)も革新的(かくしんてき)な国(くに)の一(ひと)つとされている。",
    source: "https://example.com/sweden-facts"
  },

  switzerland: {
    fact: "スイスは世界(せかい)で最(もっと)も平和(へいわ)で豊(ゆた)かな国(くに)の一(ひと)つで、永世中立国(えいせいちゅうりつこく)として知(し)られている。",
    source: "https://example.com/switzerland-facts"
  },

  syria: {
    fact: "シリアは世界最古(せかいさいこ)の都市(とし)の一(ひと)つダマスカスがあり、古代文明(こだいぶんめい)の十字路(じゅうじろ)として栄(さか)えた。",
    source: "https://example.com/syria-facts"
  },

  tajikistan: {
    fact: "タジキスタンは国土(こくど)の93%が山岳地帯(さんがくちたい)で、世界(せかい)で最(もっと)も高(たか)い山岳地帯(さんがくちたい)の一(ひと)つパミール高原(こうげん)がある。",
    source: "https://example.com/tajikistan-facts"
  },

  thailand: {
    fact: "タイは東南(とうなん)アジアで唯一(ゆいいつ)植民地化(しょくみんちか)されなかった国(くに)で、「微笑(ほほえ)みの国(くに)」として知(し)られている。",
    source: "https://example.com/thailand-facts"
  },

  timor_leste: {
    fact: "東(ひがし)ティモールは21世紀(せいき)に独立(どくりつ)した最初(さいしょ)の国(くに)で、コーヒーの産地(さんち)として有名(ゆうめい)である。",
    source: "https://example.com/timor-leste-facts"
  },

  togo: {
    fact: "トーゴは世界(せかい)で最(もっと)も細長(ほそなが)い国(くに)の一(ひと)つで、リン鉱石(こうせき)の産地(さんち)として知(し)られている。",
    source: "https://example.com/togo-facts"
  },

  tonga: {
    fact: "トンガは太平洋(たいへいよう)で唯一(ゆいいつ)植民地化(しょくみんちか)されなかった国(くに)で、世界(せかい)で最初(さいしょ)に新年(しんねん)を迎(むか)える国(くに)の一(ひと)つである。",
    source: "https://example.com/tonga-facts"
  },

  trinidad_and_tobago: {
    fact: "トリニダード・トバゴはカリブ海(かい)で最(もっと)も南(みなみ)に位置(いち)する国(くに)で、カーニバル(かーにばる)とスティールドラム(すてぃーるどらむ)の発祥地(はっしょうち)である。",
    source: "https://example.com/trinidad-and-tobago-facts"
  },

  tunisia: {
    fact: "チュニジアは古代(こだい)カルタゴの中心地(ちゅうしんち)で、アラブの春(はる)の発端(ほったん)となった国(くに)である。",
    source: "https://example.com/tunisia-facts"
  },

  turkey: {
    fact: "トルコはヨーロッパ(よーろっぱ)とアジア(あじあ)にまたがる唯一(ゆいいつ)の国(くに)で、世界(せかい)で最(もっと)も多(おお)くの世界遺産(せかいいさん)を有(ゆう)する国(くに)の一(ひと)つである。",
    source: "https://example.com/turkey-facts"
  },

  turkmenistan: {
    fact: "トルクメニスタンは世界(せかい)で4番目(ばんめ)に大(おお)きな天然(てんねん)ガス埋蔵量(まいぞうりょう)を有(ゆう)し、「地獄(じごく)の門(もん)」と呼(よ)ばれる天然(てんねん)ガスクレーター(がすくれーたー)がある。",
    source: "https://example.com/turkmenistan-facts"
  },

  tuvalu: {
    fact: "ツバルは世界(せかい)で4番目(ばんめ)に小(ちい)さな国(くに)で、気候変動(きこうへんどう)により海面上昇(かいめんじょうしょう)の影響(えいきょう)を最(もっと)も受(う)けやすい国(くに)の一(ひと)つである。",
    source: "https://example.com/tuvalu-facts"
  },

  ukraine: {
    fact: "ウクライナは世界最大(せかいさいだい)の国(くに)の一(ひと)つで、チェルノブイリ原発事故(げんぱつじこ)の現場(げんば)がある。",
    source: "https://example.com/ukraine-facts"
  },

  united_arab_emirates: {
    fact: "アラブ首長国連邦(しゅちょうこくれんぽう)は世界(せかい)で最(もっと)も高(たか)い建物(たてもの)ブルジュ・ハリファがあり、石油収入(せきゆしゅうにゅう)で急速(きゅうそく)に発展(はってん)した。",
    source: "https://example.com/uae-facts"
  },

  uruguay: {
    fact: "ウルグアイは世界(せかい)で最(もっと)も進歩的(しんぽてき)な国(くに)の一(ひと)つで、同性婚(どうせいこん)と大麻(たいま)の合法化(ごうほうか)を早期(そうき)に実現(じつげん)した。",
    source: "https://example.com/uruguay-facts"
  },

  uzbekistan: {
    fact: "ウズベキスタンは二重内陸国(にじゅうないりくこく)で、古代(こだい)シルクロード(しるくろーど)の中心地(ちゅうしんち)サマルカンドがある。",
    source: "https://example.com/uzbekistan-facts"
  },

  vanuatu: {
    fact: "バヌアツは世界(せかい)で最(もっと)も幸福(こうふく)な国(くに)の一(ひと)つとされ、活火山(かっかざん)の数(かず)が多(おお)い火山国(かざんこく)である。",
    source: "https://example.com/vanuatu-facts"
  },

  venezuela: {
    fact: "ベネズエラは世界最大(せかいさいだい)の石油埋蔵量(せきゆまいぞうりょう)を有(ゆう)し、世界最高(せかいさいこう)の滝(たき)エンジェルフォール(えんじぇるふぉーる)がある。",
    source: "https://example.com/venezuela-facts"
  },

  vietnam: {
    fact: "ベトナムは世界第(せかいだい)2位(い)のコーヒー産出国(さんしゅつこく)で、美(うつく)しいハロン湾(わん)で有名(ゆうめい)である。",
    source: "https://example.com/vietnam-facts"
  },

  zambia: {
    fact: "ザンビアは世界最大(せかいさいだい)の銅産出国(どうさんしゅつこく)の一(ひと)つで、ビクトリアの滝(たき)の一部(いちぶ)を有(ゆう)している。",
    source: "https://example.com/zambia-facts"
  },

  jersey: {
    fact: "ジャージー島(とう)は世界(せかい)で最(もっと)も大(おお)きな潮(しお)の干満(かんまん)の一(ひと)つを持(も)ち、干潮時(かんちょうじ)には島(しま)の大(おお)きさがほぼ2倍(ばい)になり、何(なん)マイルもの追加(ついか)の砂浜(すなはま)と潮(しお)だまりが現(あらわ)れる。",
    source: "https://www.roughguides.com/articles/fun-facts-about-jersey-channel-islands/"
  },

  guernsey: {
    fact: "ガーンジー島(とう)は世界最大級(せかいさいだいきゅう)の潮(しお)の干満(かんまん)（33フィート(ふぃーと)）を持(も)ち、約(やく)6時間(じかん)ごとに海岸線(かいがんせん)が劇的(げきてき)に変化(へんか)し、世界初(せかいはつ)の水中逮捕(すいちゅうたいほ)が行(おこな)われた場所(ばしょ)でもある。",
    source: "https://www.visitguernsey.com/articles/2018/ten-things-you-didn-t-know-about-guernsey"
  },

  isle_of_man: {
    fact: "マン島(とう)は世界初(せかいはつ)の国全体(くにぜんたい)がユネスコ(ゆねすこ)生物圏保護区(せいぶつけんほごく)に指定(してい)された場所(ばしょ)であり、世界最古(せかいさいこ)の継続的(けいぞくてき)な議会(ぎかい)「ティンワルド」を持(も)ち、世界(せかい)で最初(さいしょ)に女性(じょせい)に選挙権(せんきょけん)を与(あた)えた場所(ばしょ)でもある。",
    source: "https://www.visitisleofman.com/blog/read/2024/11/30-quirky-facts-about-the-isle-of-man-b405"
  },

  gibraltar: {
    fact: "ジブラルタルはヨーロッパ(よーろっぱ)で唯一(ゆいいつ)野生(やせい)のサル(さる)が生息(せいそく)する場所(ばしょ)で、約(やく)300匹(びき)のバーバリーマカクが住(す)んでおり、空港(くうこう)の滑走路(かっそうろ)が主要道路(しゅようどうろ)と交差(こうさ)しているため飛行機(ひこうき)の離着陸時(りちゃくりくじ)には道路交通(どうろこうつう)が停止(ていし)される。",
    source: "https://awaytothecity.com/facts-about-gibraltar/"
  },

  anguilla: {
    fact: "アンギラには伝統的(でんとうてき)な住所(じゅうしょ)システムがなく、住民(じゅうみん)は郵便局(ゆうびんきょく)で郵便(ゆうびん)を受(う)け取(と)り、島全体(しまぜんたい)で使用(しよう)される郵便番号(ゆうびんばんごう)は「AI-2640」のみで、ボートレース(ぼーとれーす)が国技(こくぎ)となっている。",
    source: "https://rusticpathways.com/blog/fun-facts-about-anguilla"
  },

  cayman: {
    fact: "ケイマン諸島(しょとう)には「ケイマナイト」という世界(せかい)でここにしか存在(そんざい)しない独特(どくとく)な岩石(がんせき)があり、有名(ゆうめい)なセブンマイルビーチは実際(じっさい)には約(やく)6.3マイルの長(なが)さで、観光(かんこう)シーズンには人口(じんこう)が2倍以上(ばいいじょう)に増加(ぞうか)する。",
    source: "https://morritts.com/blog/10-fascinating-facts-about-the-cayman-islands/"
  },

  bermuda: {
    fact: "バミューダはイギリス最古(さいこ)の植民地(しょくみんち)で、有名(ゆうめい)な「バミューダショーツ」は膝上(ひざうえ)6インチより短(みじか)く着用(ちゃくよう)することが法律(ほうりつ)で禁止(きんし)されており、島(しま)には川(かわ)や湖(みずうみ)がないため雨水(あまみず)を地下(ちか)タンクに集(あつ)める白(しろ)い階段状(かいだんじょう)の屋根(やね)が特徴的(とくちょうてき)。",
    source: "https://www.gotobermuda.com/inspiration/article/bermudas-culture-quick-snapshot"
  },

  reunion: {
    fact: "レユニオン島(とう)は世界(せかい)で最(もっと)も雨(あめ)の多(おお)い場所(ばしょ)の一(ひと)つで、2007年(ねん)のサイクロン・ガメデ時(じ)に24時間(じかん)で71.85インチ（1.825メートル）の世界記録的降雨量(せかいきろくてきこううりょう)を記録(きろく)し、パリからレユニオンまでの5,808マイルは世界最長(せかいさいちょう)の国内線(こくないせん)フライトとなっている。",
    source: "https://rusticpathways.com/inside-rustic/online-magazine/fun-facts-about-la-reunion"
  },

  mayotte: {
    fact: "マヨットはアフリカ沖(おき)のインド洋(よう)に位置(いち)しながらフランス海外県(かいがいけん)としてEUの一部(いちぶ)であり、世界最大級(せかいさいだいきゅう)のラグーン（1,100平方(へいほう)キロメートル）を持(も)ち、「香(かお)りの島(しま)」として知(し)られイランイランの世界的産地(せかいてきさんち)となっている。",
    source: "https://etichotels.com/journal/10-surprising-facts-about-mayotte/"
  },

  aruba: {
    fact: "アルバは世界(せかい)で最(もっと)も民族的(みんぞくてき)に多様(たよう)な人口(じんこう)を持(も)つ国(くに)の一(ひと)つで90以上(いじょう)の国籍(こくせき)・民族(みんぞく)グループが住(す)み、住民(じゅうみん)は最低(さいてい)4言語(げんご)（英語(えいご)、スペイン語(ご)、オランダ語(ご)、パピアメント語(ご)）を話(はな)し、ギャンブルの勝利金(しょうりきん)に税金(ぜいきん)がかからない。",
    source: "https://www.aruba.com/us/blog/16-facts-about-aruba-that-will-surprise-you"
  },

  south_ossetia: {
    fact: "南オセチアは国際的(こくさいてき)に広(ひろ)く承認(しょうにん)されていない事実上(じじつじょう)の独立国家(どくりつこっか)で、ジョージア(グルジア)の一部(いちぶ)とされているが、ロシアなど一部(いちぶ)の国(くに)から独立(どくりつ)を承認(しょうにん)されている。",
    source: "https://example.com/south-ossetia-facts"
  },

  luhansk: {
    fact: "ルハンスクは国際的(こくさいてき)に広(ひろ)く承認(しょうにん)されていない事実上(じじつじょう)の独立国家(どくりつこっか)で、ウクライナの一部(いちぶ)とされているが、ロシアなど一部(いちぶ)の国(くに)から独立(どくりつ)を承認(しょうにん)されている。",
    source: "https://example.com/luhansk-facts"
  },

  donetsk: {
    fact: "ドネツクは国際的(こくさいてき)に広(ひろ)く承認(しょうにん)されていない事実上(じじつじょう)の独立国家(どくりつこっか)で、ウクライナの一部(いちぶ)とされているが、ロシアなど一部(いちぶ)の国(くに)から独立(どくりつ)を承認(しょうにん)されている。",
    source: "https://example.com/donetsk-facts"
  },

  new_caledonia: {
    fact: "ニューカレドニアはフランスの海外領土(かいがいりょうど)で、世界(せかい)で2番目(ばんめ)に大(おお)きいサンゴ礁(しょう)を持(も)ち、その広(ひろ)さは約(やく)1,600キロメートルに及(およ)び、固有種(こゆうしゅ)が多(おお)く生息(せいそく)し、特(とく)にカグー鳥(どり)は飛(と)べない鳥(とり)として有名(ゆうめい)で、ニッケルの世界的(せかいてき)な産地(さんち)としても知(し)られている。",
    source: "https://www.newcaledonia.travel/en/discover/new-caledonia-facts"
  },

  virgin_islands_uk: {
    fact: "イギリス領ヴァージン諸島(しょとう)は「カリブ海(かい)のヨットの首都(しゅと)」として知(し)られ、60以上(いじょう)の島々(しまじま)からなり、その多(おお)くは火山起源(かざんきげん)で、世界(せかい)で最(もっと)も美(うつく)しいビーチの一(ひと)つであるホワイトベイを有(ゆう)している。",
    source: "https://example.com/virgin-islands-uk-facts"
  },

  virgin_islands_us: {
    fact: "アメリカ領ヴァージン諸島(しょとう)は以前(いぜん)デンマーク領(りょう)だったが1917年(ねん)に米国(べいこく)に売却(ばいきゃく)され、セントトーマス島(とう)には世界(せかい)で2番目(ばんめ)に古(ふる)いユダヤ教会堂(きょうかいどう)があり、島民(とうみん)は道路(どうろ)の左側(ひだりがわ)を運転(うんてん)する。",
    source: "https://example.com/virgin-islands-us-facts"
  },

  abkhazia: {
    fact: "アブハジアは国際的(こくさいてき)に広(ひろ)く承認(しょうにん)されていない事実上(じじつじょう)の独立国家(どくりつこっか)で、ジョージア(グルジア)の一部(いちぶ)とされているが、ロシアなど一部(いちぶ)の国(くに)から独立(どくりつ)を承認(しょうにん)されており、黒海(くろうみ)沿岸(えんがん)に位置(いち)し美(うつく)しい山岳地帯(さんがくちたい)と海岸線(かいがんせん)を持(も)つ。",
    source: "https://example.com/abkhazia-facts"
  },

  aland: {
    fact: "オーランド諸島(しょとう)はフィンランドの自治領(じちりょう)だが、住民(じゅうみん)の95%はスウェーデン語(ご)を話(はな)し、独自(どくじ)の旗(はた)と切手(きって)を持(も)ち、EU加盟(かめい)にもかかわらず税関(ぜいかん)の特別(とくべつ)免除(めんじょ)を受(う)け、6,500以上(いじょう)の島々(しまじま)からなる群島(ぐんとう)で、赤(あか)い土壌(どじょう)と白(しろ)い石灰岩(せっかいがん)の独特(どくとく)な景観(けいかん)で知(し)られている。",
    source: "https://www.visitaland.com/en/articles/10-facts-about-aland/"
  },


};

// ユーティリティ関数(かんすう)
export function getTotalCountries(): number {
  return Object.keys(nationsFacts).length;
}

export function getCountryFact(countryCode: string): CountryFact | undefined {
  return nationsFacts[countryCode];
}

export function getAllCountryCodes(): string[] {
  return Object.keys(nationsFacts);
}

export function getRandomCountryFact(): { countryCode: string; fact: CountryFact } {
  const codes = getAllCountryCodes();
  const randomCode = codes[Math.floor(Math.random() * codes.length)];
  return {
    countryCode: randomCode,
    fact: nationsFacts[randomCode]
  };
}

// 地域別(ちいきべつ)の国(くに)コード取得(しゅとく)
export function getCountriesByRegion(region: 'asia' | 'europe' | 'africa' | 'north_america' | 'south_america' | 'oceania' | 'territories'): string[] {
  // 簡易的(かんいてき)な地域分類(ちいきぶんるい)（実際(じっさい)の実装(じっそう)では詳細(しょうさい)な地域(ちいき)データを 使用(しよう)）
  const regionMapping: Record<string, string[]> = {
    asia: ['japan', 'china', 'south_korea', 'mongolia', 'taiwan', 'india', 'indonesia', 'hong_kong'],
    europe: ['germany', 'united_kingdom', 'vatican_city', 'russia'],
    africa: ['algeria', 'angola', 'benin', 'botswana'],
    north_america: ['usa', 'mexico'],
    south_america: ['venezuela', 'colombia', 'bolivia', 'costa_rica', 'ecuador', 'argentina', 'brazil', 'peru', 'chile'],
    oceania: [],
    territories: ['jersey', 'guernsey', 'isle_of_man', 'gibraltar', 'anguilla', 'cayman_islands', 'bermuda', 'reunion', 'mayotte', 'aruba']
  };
  
  return regionMapping[region] || [];
}

export default nationsFacts;