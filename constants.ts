
import { LibraryData, ReaderBook } from './types';

export const LIBRARY_101: LibraryData = {
  "library": {
    "name": "Library101",
    "concept": "人类文明101部核心著作",
    "total_books": 101,
    "curation_date": "2024",
    "description": "按文明发展时期组织的101本人类思想精华"
  },
  "periods": {
    "ancient_axial": {
      "period_name": "古代轴心期",
      "era": "轴心时代",
      "time_range": "约公元前800年 - 公元前200年",
      "description": "人类文明的轴心突破期，各大文明同时出现根本性思想革命",
      "key_characteristics": ["哲学突破", "宗教改革", "伦理体系建立", "理性与启示的分化"],
      "total_books": 20,
      "books": [
        {
          "id": "001",
          "title_original": "易经",
          "title_translations": { "en": "Book of Changes", "zh": "易经" },
          "author": { "name_original": "周文王等", "name_latinized": "King Wen of Zhou et al.", "name_chinese": "周文王等", "lifespan": "前11世纪-前5世纪", "civilization": "Ancient China" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前1000-前500年", "original_language": "文言文", "genre": ["占卜", "哲学", "宇宙论"], "length_category": "中等", "difficulty_level": 9, "babel_rating": 8.5 },
          "civilization_context": { "region": "东亚", "cultural_sphere": "汉字文化圈", "historical_context": "周朝早期，中国哲学思想萌芽期", "contemporary_works": ["尚书", "诗经"], "predecessors": ["甲骨文占卜"], "successors": ["儒家注释", "道家思想"] },
          "thematic_tags": [{ "tag": "宇宙论", "weight": 0.9 }, { "tag": "变化", "weight": 0.9 }, { "tag": "占卜", "weight": 0.8 }, { "tag": "阴阳", "weight": 0.9 }, { "tag": "六十四卦", "weight": 0.8 }, { "tag": "和谐", "weight": 0.7 }]
        },
        {
          "id": "002",
          "title_original": "道德经",
          "title_translations": { "en": "Tao Te Ching", "zh": "道德经" },
          "author": { "name_original": "老子", "name_latinized": "Laozi", "name_chinese": "老子", "lifespan": "公元前6-4世纪（传统说法）", "civilization": "Ancient China" },
          "metadata": { "period": "古代轴心期", "estimated_date": "公元前4世纪", "original_language": "文言文", "genre": ["哲学", "诗歌", "智慧文学"], "length_category": "短", "difficulty_level": 7, "babel_rating": 9.5 },
          "civilization_context": { "region": "东亚", "cultural_sphere": "汉字文化圈", "historical_context": "春秋战国时期，周王室衰微", "contemporary_works": ["论语", "墨子"], "predecessors": ["易经", "诗经"], "successors": ["庄子", "淮南子"] },
          "thematic_tags": [{ "tag": "形而上学", "weight": 0.9 }, { "tag": "伦理", "weight": 0.8 }, { "tag": "政治哲学", "weight": 0.7 }, { "tag": "自然", "weight": 0.9 }, { "tag": "无为", "weight": 0.9 }, { "tag": "简朴", "weight": 0.8 }]
        },
        {
          "id": "003",
          "title_original": "论语",
          "title_translations": { "en": "Analects", "zh": "论语" },
          "author": { "name_original": "孔子及弟子", "name_latinized": "Confucius and disciples", "name_chinese": "孔子及弟子", "lifespan": "公元前551-前479年", "civilization": "Ancient China" },
          "metadata": { "period": "古代轴心期", "estimated_date": "公元前5-前4世纪", "original_language": "文言文", "genre": ["哲学", "伦理", "格言"], "length_category": "中等", "difficulty_level": 6, "babel_rating": 9.3 },
          "civilization_context": { "region": "东亚", "cultural_sphere": "汉字文化圈", "historical_context": "春秋末期，礼崩乐坏", "contemporary_works": ["道德经", "墨子"], "predecessors": ["周礼", "诗经"], "successors": ["孟子", "荀子"] },
          "thematic_tags": [{ "tag": "伦理", "weight": 0.9 }, { "tag": "教育", "weight": 0.8 }, { "tag": "治国", "weight": 0.8 }, { "tag": "礼", "weight": 0.7 }, { "tag": "孝道", "weight": 0.8 }, { "tag": "仁", "weight": 0.9 }]
        },
        {
          "id": "004",
          "title_original": "庄子",
          "title_translations": { "en": "Zhuangzi", "zh": "庄子" },
          "author": { "name_original": "庄周", "name_latinized": "Zhuang Zhou", "name_chinese": "庄周", "lifespan": "约公元前369-前286年", "civilization": "Ancient China" },
          "metadata": { "period": "古代轴心期", "estimated_date": "公元前4-前3世纪", "original_language": "文言文", "genre": ["哲学", "寓言", "文学"], "length_category": "中等", "difficulty_level": 8, "babel_rating": 9.3 },
          "civilization_context": { "region": "东亚", "cultural_sphere": "汉字文化圈", "historical_context": "战国时期，百家争鸣", "contemporary_works": ["孟子", "荀子"], "predecessors": ["老子", "列子"], "successors": ["淮南子", "魏晋玄学"] },
          "thematic_tags": [{ "tag": "相对主义", "weight": 0.9 }, { "tag": "自然自发", "weight": 0.9 }, { "tag": "梦与现实", "weight": 0.8 }, { "tag": "怀疑论", "weight": 0.7 }, { "tag": "自由", "weight": 0.8 }, { "tag": "自然", "weight": 0.8 }]
        },
        {
          "id": "005",
          "title_original": "ऋग्वेद",
          "title_translations": { "en": "Rigveda", "zh": "梨俱吠陀" },
          "author": { "name_original": "ऋषि (仙人)", "name_latinized": "Rishis (seers)", "name_chinese": "仙人", "lifespan": "公元前1500-前1000年", "civilization": "Ancient India" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前1500-前1000年", "original_language": "吠陀梵语", "genre": ["颂歌", "祷文", "诗歌"], "length_category": "长", "difficulty_level": 9, "babel_rating": 8.8 },
          "civilization_context": { "region": "南亚", "cultural_sphere": "印度文化圈", "historical_context": "吠陀时期，印度河文明之后", "contemporary_works": ["其他吠陀"], "predecessors": ["印度河文明"], "successors": ["奥义书", "梵书"] },
          "thematic_tags": [{ "tag": "颂歌", "weight": 0.9 }, { "tag": "仪式", "weight": 0.8 }, { "tag": "神祇", "weight": 0.9 }, { "tag": "宇宙论", "weight": 0.7 }, { "tag": "献祭", "weight": 0.8 }, { "tag": "口传传统", "weight": 0.9 }]
        },
        {
          "id": "006",
          "title_original": "उपनिषद्",
          "title_translations": { "en": "Upanishads", "zh": "奥义书" },
          "author": { "name_original": "ऋषि (仙人)", "name_latinized": "Various rishis", "name_chinese": "仙人", "lifespan": "公元前800-前500年", "civilization": "Ancient India" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前800-前500年", "original_language": "梵语", "genre": ["哲学", "神秘主义", "对话"], "length_category": "中等", "difficulty_level": 9, "babel_rating": 9.2 },
          "civilization_context": { "region": "南亚", "cultural_sphere": "印度文化圈", "historical_context": "后期吠陀时期，森林书传统", "contemporary_works": ["早期佛教经典"], "predecessors": ["吠陀", "梵书"], "successors": ["吠檀多", "佛教哲学"] },
          "thematic_tags": [{ "tag": "形而上学", "weight": 0.9 }, { "tag": "神秘主义", "weight": 0.9 }, { "tag": "梵我一如", "weight": 0.9 }, { "tag": "解脱", "weight": 0.8 }, { "tag": "瑜伽", "weight": 0.7 }, { "tag": "超越", "weight": 0.8 }]
        },
        {
          "id": "007",
          "title_original": "भगवद्गीता",
          "title_translations": { "en": "Bhagavad Gita", "zh": "薄伽梵歌" },
          "author": { "name_original": "व्यास (传统上)", "name_latinized": "Vyasa (traditionally)", "name_chinese": "毗耶娑（传统）", "lifespan": "公元前5-前2世纪", "civilization": "Ancient India" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前5-前2世纪", "original_language": "梵语", "genre": ["哲学", "诗歌", "对话"], "length_category": "短", "difficulty_level": 7, "babel_rating": 9.4 },
          "civilization_context": { "region": "南亚", "cultural_sphere": "印度文化圈", "historical_context": "史诗时期，印度教综合形成期", "contemporary_works": ["摩诃婆罗多其他部分", "早期佛教经典"], "predecessors": ["奥义书", "数论瑜伽"], "successors": ["印度教哲学", "虔信运动"] },
          "thematic_tags": [{ "tag": "达摩", "weight": 0.9 }, { "tag": "瑜伽", "weight": 0.8 }, { "tag": "虔信", "weight": 0.8 }, { "tag": "责任", "weight": 0.9 }, { "tag": "业", "weight": 0.8 }, { "tag": "化身", "weight": 0.7 }]
        },
        {
          "id": "008",
          "title_original": "जातक",
          "title_translations": { "en": "Jataka Tales", "zh": "佛本生经" },
          "author": { "name_original": "佛教僧团", "name_latinized": "Buddhist sangha", "name_chinese": "佛教僧团", "lifespan": "公元前3世纪", "civilization": "Ancient India" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前3世纪", "original_language": "巴利语", "genre": ["故事", "寓言", "伦理"], "length_category": "长", "difficulty_level": 5, "babel_rating": 8.2 },
          "civilization_context": { "region": "南亚", "cultural_sphere": "印度文化圈", "historical_context": "阿育王时期，佛教传播", "contemporary_works": ["阿含经", "律藏"], "predecessors": ["民间故事", "早期佛教教义"], "successors": ["大乘佛教经典", "亚洲佛教文学"] },
          "thematic_tags": [{ "tag": "寓言", "weight": 0.9 }, { "tag": "伦理", "weight": 0.8 }, { "tag": "轮回", "weight": 0.8 }, { "tag": "慈悲", "weight": 0.8 }, { "tag": "智慧", "weight": 0.7 }, { "tag": "民间文学", "weight": 0.7 }]
        },
        {
          "id": "009",
          "title_original": "𒄑𒂆𒈦",
          "title_translations": { "en": "Epic of Gilgamesh", "zh": "吉尔伽美什史诗" },
          "author": { "name_original": "匿名", "name_latinized": "Anonymous", "name_chinese": "佚名", "lifespan": "公元前2100年", "civilization": "Mesopotamia" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前2100年", "original_language": "阿卡德语", "genre": ["史诗", "诗歌", "神话"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 8.9 },
          "civilization_context": { "region": "美索不达米亚", "cultural_sphere": "古代近东", "historical_context": "苏美尔-阿卡德文明，城市国家时期", "contemporary_works": ["汉谟拉比法典"], "predecessors": ["苏美尔神话"], "successors": ["希伯来圣经", "希腊史诗"] },
          "thematic_tags": [{ "tag": "史诗", "weight": 0.9 }, { "tag": "死亡", "weight": 0.9 }, { "tag": "友谊", "weight": 0.8 }, { "tag": "王权", "weight": 0.7 }, { "tag": "洪水神话", "weight": 0.8 }, { "tag": "文明", "weight": 0.7 }]
        },
        {
          "id": "010",
          "title_original": "תנ'ך",
          "title_translations": { "en": "Hebrew Bible", "zh": "希伯来圣经" },
          "author": { "name_original": "多位作者", "name_latinized": "Multiple authors", "name_chinese": "多位作者", "lifespan": "公元前12-前2世纪", "civilization": "Ancient Israel" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前12-前2世纪", "original_language": "圣经希伯来语", "genre": ["经文", "历史", "律法", "诗歌"], "length_category": "极长", "difficulty_level": 8, "babel_rating": 9.7 },
          "civilization_context": { "region": "黎凡特", "cultural_sphere": "古代近东", "historical_context": "以色列王国时期至第二圣殿时期", "contemporary_works": ["美索不达米亚文献", "埃及智慧文学"], "predecessors": ["古代近东神话"], "successors": ["新约", "塔木德"] },
          "thematic_tags": [{ "tag": "一神论", "weight": 0.9 }, { "tag": "圣约", "weight": 0.8 }, { "tag": "先知", "weight": 0.8 }, { "tag": "律法", "weight": 0.7 }, { "tag": "历史", "weight": 0.7 }, { "tag": "智慧", "weight": 0.7 }]
        },
        {
          "id": "011",
          "title_original": "𐬀𐬬𐬈𐬯𐬙𐬀",
          "title_translations": { "en": "Avesta", "zh": "阿维斯塔" },
          "author": { "name_original": "琐罗亚斯德", "name_latinized": "Zoroaster", "name_chinese": "琐罗亚斯德", "lifespan": "公元前10-前7世纪", "civilization": "Ancient Persia" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前10-前7世纪", "original_language": "阿维斯坦语", "genre": ["经文", "颂歌", "律法"], "length_category": "长", "difficulty_level": 9, "babel_rating": 8.5 },
          "civilization_context": { "region": "波斯", "cultural_sphere": "伊朗文化圈", "historical_context": "古代波斯，阿契美尼德帝国前", "contemporary_works": ["梨俱吠陀", "希伯来圣经"], "predecessors": ["古代伊朗宗教"], "successors": ["帕拉维文献", "摩尼教"] },
          "thematic_tags": [{ "tag": "二元论", "weight": 0.9 }, { "tag": "宇宙斗争", "weight": 0.8 }, { "tag": "末世论", "weight": 0.8 }, { "tag": "火崇拜", "weight": 0.7 }, { "tag": "伦理", "weight": 0.7 }, { "tag": "颂歌", "weight": 0.8 }]
        },
        {
          "id": "012",
          "title_original": "rw nw prt m hrw",
          "title_translations": { "en": "Book of the Dead", "zh": "亡灵书" },
          "author": { "name_original": "埃及祭司", "name_latinized": "Egyptian priests", "name_chinese": "埃及祭司", "lifespan": "公元前1550-前50年", "civilization": "Ancient Egypt" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前1550-前50年", "original_language": "古埃及语", "genre": ["丧葬文本", "仪式", "神话"], "length_category": "中等", "difficulty_level": 8, "babel_rating": 8.3 },
          "civilization_context": { "region": "埃及", "cultural_sphere": "古埃及", "historical_context": "新王国时期至托勒密时期", "contemporary_works": ["金字塔文本", "棺木文本"], "predecessors": ["金字塔文本"], "successors": ["希腊化埃及宗教", "诺斯替主义"] },
          "thematic_tags": [{ "tag": "来世", "weight": 0.9 }, { "tag": "审判", "weight": 0.8 }, { "tag": "魔法", "weight": 0.8 }, { "tag": "仪式", "weight": 0.8 }, { "tag": "道德考验", "weight": 0.7 }, { "tag": "复活", "weight": 0.7 }]
        },
        {
          "id": "013",
          "title_original": "Ἰλιάς, Ὀδύσσεια",
          "title_translations": { "en": "Iliad, Odyssey", "zh": "伊利亚特, 奥德赛" },
          "author": { "name_original": "Ὅμηρος", "name_latinized": "Homer", "name_chinese": "荷马", "lifespan": "公元前8世纪", "civilization": "Ancient Greece" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前8世纪", "original_language": "古希腊语", "genre": ["史诗", "诗歌", "神话"], "length_category": "极长", "difficulty_level": 8, "babel_rating": 9.6 },
          "civilization_context": { "region": "希腊", "cultural_sphere": "希腊文化圈", "historical_context": "古希腊黑暗时代后，城邦形成期", "contemporary_works": ["赫西俄德作品"], "predecessors": ["迈锡尼文明传统"], "successors": ["希腊悲剧", "维吉尔史诗"] },
          "thematic_tags": [{ "tag": "史诗", "weight": 0.9 }, { "tag": "英雄主义", "weight": 0.9 }, { "tag": "命运", "weight": 0.8 }, { "tag": "归乡", "weight": 0.8 }, { "tag": "荣誉", "weight": 0.8 }, { "tag": "好客", "weight": 0.7 }]
        },
        {
          "id": "014",
          "title_original": "Ἔργα καὶ Ἡμέραι",
          "title_translations": { "en": "Works and Days", "zh": "工作与时日" },
          "author": { "name_original": "Ἡσίοδος", "name_latinized": "Hesiod", "name_chinese": "赫西俄德", "lifespan": "公元前7世纪", "civilization": "Ancient Greece" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前700年", "original_language": "古希腊语", "genre": ["教谕诗", "神话", "伦理"], "length_category": "短", "difficulty_level": 7, "babel_rating": 8.2 },
          "civilization_context": { "region": "希腊", "cultural_sphere": "希腊文化圈", "historical_context": "古希腊古风时期", "contemporary_works": ["荷马史诗"], "predecessors": ["荷马"], "successors": ["希腊哲学", "田园诗"] },
          "thematic_tags": [{ "tag": "教谕", "weight": 0.9 }, { "tag": "农耕", "weight": 0.8 }, { "tag": "正义", "weight": 0.7 }, { "tag": "神话", "weight": 0.8 }, { "tag": "劳动", "weight": 0.8 }, { "tag": "伦理", "weight": 0.7 }]
        },
        {
          "id": "015",
          "title_original": "Πολιτεία",
          "title_translations": { "en": "The Republic", "zh": "理想国" },
          "author": { "name_original": "Πλάτων", "name_latinized": "Plato", "name_chinese": "柏拉图", "lifespan": "约公元前428/427-348/347年", "civilization": "Ancient Greece" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前380年", "original_language": "古希腊语", "genre": ["哲学", "政治理论", "对话"], "length_category": "长", "difficulty_level": 8, "babel_rating": 9.8 },
          "civilization_context": { "region": "希腊", "cultural_sphere": "希腊文化圈", "historical_context": "伯罗奔尼撒战争后，苏格拉底审判后", "contemporary_works": ["其他柏拉图对话", "早期亚里士多德"], "predecessors": ["苏格拉底", "毕达哥拉斯", "赫拉克利特"], "successors": ["新柏拉图主义", "基督教神学"] },
          "thematic_tags": [{ "tag": "正义", "weight": 0.9 }, { "tag": "理想国", "weight": 0.9 }, { "tag": "理念论", "weight": 0.8 }, { "tag": "教育", "weight": 0.7 }, { "tag": "哲人王", "weight": 0.8 }, { "tag": "寓言", "weight": 0.7 }]
        },
        {
          "id": "016",
          "title_original": "Μετὰ τὰ φυσικά",
          "title_translations": { "en": "Metaphysics", "zh": "形而上学" },
          "author": { "name_original": "Ἀριστοτέλης", "name_latinized": "Aristotle", "name_chinese": "亚里士多德", "lifespan": "公元前384-322年", "civilization": "Ancient Greece" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前4世纪", "original_language": "古希腊语", "genre": ["哲学", "形而上学", "系统性"], "length_category": "长", "difficulty_level": 9, "babel_rating": 9.7 },
          "civilization_context": { "region": "希腊", "cultural_sphere": "希腊文化圈", "historical_context": "亚历山大大帝时期，希腊化时代开始", "contemporary_works": ["其他亚里士多德著作"], "predecessors": ["柏拉图", "前苏格拉底哲学"], "successors": ["希腊化哲学", "中世纪经院哲学"] },
          "thematic_tags": [{ "tag": "形而上学", "weight": 0.9 }, { "tag": "存在", "weight": 0.9 }, { "tag": "因果性", "weight": 0.8 }, { "tag": "实体", "weight": 0.8 }, { "tag": "目的论", "weight": 0.8 }, { "tag": "系统性", "weight": 0.9 }]
        },
        {
          "id": "017",
          "title_original": "诗经",
          "title_translations": { "en": "Book of Songs", "zh": "诗经" },
          "author": { "name_original": "多人", "name_latinized": "Various", "name_chinese": "多人", "lifespan": "公元前11-前6世纪", "civilization": "Ancient China" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前11-前6世纪", "original_language": "文言文", "genre": ["诗歌", "民歌", "礼仪"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 8.7 },
          "civilization_context": { "region": "东亚", "cultural_sphere": "汉字文化圈", "historical_context": "周朝，采诗制度", "contemporary_works": ["尚书", "易经"], "predecessors": ["口传诗歌"], "successors": ["楚辞", "汉赋"] },
          "thematic_tags": [{ "tag": "诗歌", "weight": 0.9 }, { "tag": "民歌", "weight": 0.8 }, { "tag": "礼仪", "weight": 0.7 }, { "tag": "爱情", "weight": 0.7 }, { "tag": "自然", "weight": 0.7 }, { "tag": "宫廷生活", "weight": 0.6 }]
        },
        {
          "id": "018",
          "title_original": "महाभारत",
          "title_translations": { "en": "Mahabharata", "zh": "摩诃婆罗多" },
          "author": { "name_original": "व्यास", "name_latinized": "Vyasa", "name_chinese": "毗耶娑", "lifespan": "公元前4世纪-公元4世纪", "civilization": "Ancient India" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前4世纪 - 公元4世纪", "original_language": "梵语", "genre": ["史诗", "神话", "哲学"], "length_category": "极长", "difficulty_level": 8, "babel_rating": 9.1 },
          "civilization_context": { "region": "南亚", "cultural_sphere": "印度文化圈", "historical_context": "印度史诗时期，印度教综合", "contemporary_works": ["罗摩衍那", "往世书"], "predecessors": ["吠陀", "奥义书"], "successors": ["古典梵语文学", "地方语言版本"] },
          "thematic_tags": [{ "tag": "史诗", "weight": 0.9 }, { "tag": "达摩", "weight": 0.9 }, { "tag": "战争", "weight": 0.8 }, { "tag": "神话", "weight": 0.8 }, { "tag": "伦理", "weight": 0.8 }, { "tag": "哲学", "weight": 0.7 }]
        },
        {
          "id": "019",
          "title_original": "Ἱστορίαι",
          "title_translations": { "en": "Histories", "zh": "历史" },
          "author": { "name_original": "Ἡρόδοτος", "name_latinized": "Herodotus", "name_chinese": "希罗多德", "lifespan": "约公元前484-前425年", "civilization": "Ancient Greece" },
          "metadata": { "period": "古代轴心期", "estimated_date": "约公元前5世纪", "original_language": "古希腊语", "genre": ["历史", "民族志", "叙事"], "length_category": "长", "difficulty_level": 7, "babel_rating": 8.8 },
          "civilization_context": { "region": "希腊", "cultural_sphere": "希腊文化圈", "historical_context": "波斯战争后，希腊黄金时代", "contemporary_works": ["修昔底德历史"], "predecessors": ["史诗传统", "地理记载"], "successors": ["希腊罗马历史学"] },
          "thematic_tags": [{ "tag": "历史", "weight": 0.9 }, { "tag": "民族志", "weight": 0.8 }, { "tag": "战争", "weight": 0.7 }, { "tag": "文化", "weight": 0.8 }, { "tag": "旅行", "weight": 0.7 }, { "tag": "探究", "weight": 0.8 }]
        }
      ]
    },
    "classical_empire": {
      "period_name": "古典帝国期",
      "era": "古典帝国",
      "time_range": "约公元前200年 - 公元500年",
      "description": "大帝国的建立与巩固期，世界宗教形成，跨文明交流增加",
      "key_characteristics": ["帝国统治", "世界宗教传播", "法律编纂", "跨区域贸易"],
      "total_books": 15,
      "books": [
        {
          "id": "020",
          "title_original": "史记",
          "title_translations": { "en": "Records of the Grand Historian", "zh": "史记" },
          "author": { "name_original": "司马迁", "name_latinized": "Sima Qian", "name_chinese": "司马迁", "lifespan": "约公元前145-前86年", "civilization": "Han China" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约公元前1世纪", "original_language": "文言文", "genre": ["历史", "传记", "编年"], "length_category": "极长", "difficulty_level": 8, "babel_rating": 9.2 },
          "civilization_context": { "region": "东亚", "cultural_sphere": "汉字文化圈", "historical_context": "西汉武帝时期，中国统一帝国巩固", "contemporary_works": ["汉书", "盐铁论"], "predecessors": ["春秋", "左传"], "successors": ["历代正史", "中国史学传统"] },
          "thematic_tags": [{ "tag": "历史", "weight": 0.9 }, { "tag": "传记", "weight": 0.8 }, { "tag": "编年", "weight": 0.8 }, { "tag": "道德评判", "weight": 0.7 }, { "tag": "治国", "weight": 0.7 }, { "tag": "文化记忆", "weight": 0.8 }]
        },
        {
          "id": "021",
          "title_original": "Aeneis",
          "title_translations": { "en": "Aeneid", "zh": "埃涅阿斯纪" },
          "author": { "name_original": "Publius Vergilius Maro", "name_latinized": "Virgil", "name_chinese": "维吉尔", "lifespan": "公元前70-19年", "civilization": "Roman Empire" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约公元前29-19年", "original_language": "拉丁语", "genre": ["史诗", "诗歌", "建国神话"], "length_category": "长", "difficulty_level": 8, "babel_rating": 9.3 },
          "civilization_context": { "region": "地中海", "cultural_sphere": "罗马", "historical_context": "奥古斯都时期，罗马帝国建立", "contemporary_works": ["贺拉斯诗歌", "李维历史"], "predecessors": ["荷马史诗", "希腊化诗歌"], "successors": ["中世纪拉丁史诗", "文艺复兴史诗"] },
          "thematic_tags": [{ "tag": "史诗", "weight": 0.9 }, { "tag": "建国", "weight": 0.9 }, { "tag": "命运", "weight": 0.8 }, { "tag": "虔敬", "weight": 0.8 }, { "tag": "文明", "weight": 0.7 }, { "tag": "帝国天命", "weight": 0.8 }]
        },
        {
          "id": "022",
          "title_original": "Καινὴ Διαθήκη",
          "title_translations": { "en": "New Testament", "zh": "新约" },
          "author": { "name_original": "多位使徒与早期基督徒", "name_latinized": "Various apostles and early Christians", "name_chinese": "多位使徒与早期基督徒", "lifespan": "公元1-2世纪", "civilization": "Roman Empire" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约公元50-150年", "original_language": "通用希腊语", "genre": ["经文", "福音", "书信", "启示"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 9.8 },
          "civilization_context": { "region": "地中海", "cultural_sphere": "早期基督教", "historical_context": "罗马帝国早期，耶稣运动传播", "contemporary_works": ["犹太教拉比文献", "希腊罗马哲学"], "predecessors": ["希伯来圣经", "第二圣殿犹太教"], "successors": ["教父著作", "基督教神学"] },
          "thematic_tags": [{ "tag": "福音", "weight": 0.9 }, { "tag": "救赎", "weight": 0.9 }, { "tag": "恩典", "weight": 0.8 }, { "tag": "教会", "weight": 0.7 }, { "tag": "启示", "weight": 0.7 }, { "tag": "爱", "weight": 0.8 }]
        },
        {
          "id": "023",
          "title_original": "De rerum natura",
          "title_translations": { "en": "On the Nature of Things", "zh": "物性论" },
          "author": { "name_original": "Titus Lucretius Carus", "name_latinized": "Lucretius", "name_chinese": "卢克莱修", "lifespan": "约公元前99-55年", "civilization": "Roman Republic" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约公元前1世纪", "original_language": "拉丁语", "genre": ["哲学", "诗歌", "科学"], "length_category": "长", "difficulty_level": 8, "babel_rating": 8.9 },
          "civilization_context": { "region": "地中海", "cultural_sphere": "罗马", "historical_context": "罗马共和国晚期，内战时期", "contemporary_works": ["西塞罗著作", "凯撒战记"], "predecessors": ["伊壁鸠鲁", "希腊哲学诗"], "successors": ["文艺复兴自然哲学", "启蒙唯物主义"] },
          "thematic_tags": [{ "tag": "伊壁鸠鲁主义", "weight": 0.9 }, { "tag": "原子论", "weight": 0.8 }, { "tag": "唯物主义", "weight": 0.9 }, { "tag": "科学诗", "weight": 0.8 }, { "tag": "死亡恐惧", "weight": 0.8 }, { "tag": "自然世界", "weight": 0.8 }]
        },
        {
          "id": "024",
          "title_original": "Τὰ εἰς ἑαυτόν",
          "title_translations": { "en": "Meditations", "zh": "沉思录" },
          "author": { "name_original": "Μᾶρκος Αὐρήλιος Ἀντωνῖνος", "name_latinized": "Marcus Aurelius", "name_chinese": "马可·奥勒留", "lifespan": "121-180年", "civilization": "Roman Empire" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约170-180年", "original_language": "希腊语", "genre": ["哲学", "日记", "自助"], "length_category": "短", "difficulty_level": 6, "babel_rating": 9.1 },
          "civilization_context": { "region": "地中海", "cultural_sphere": "罗马", "historical_context": "罗马帝国黄金时代，但面临危机", "contemporary_works": ["爱比克泰德著作", "罗马法编纂"], "predecessors": ["斯多葛哲学", "塞涅卡"], "successors": ["晚期斯多葛主义", "基督教苦修主义"] },
          "thematic_tags": [{ "tag": "斯多葛主义", "weight": 0.9 }, { "tag": "自律", "weight": 0.9 }, { "tag": "帝王责任", "weight": 0.7 }, { "tag": "德性", "weight": 0.8 }, { "tag": "接纳", "weight": 0.8 }, { "tag": "正念", "weight": 0.8 }]
        },
        {
          "id": "025",
          "title_original": "黄帝内经",
          "title_translations": { "en": "Yellow Emperor's Inner Canon", "zh": "黄帝内经" },
          "author": { "name_original": "托名黄帝", "name_latinized": "Attributed to Yellow Emperor", "name_chinese": "托名黄帝", "lifespan": "公元前3-1世纪", "civilization": "Han China" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约公元前3-前1世纪", "original_language": "文言文", "genre": ["医学", "哲学", "养生"], "length_category": "长", "difficulty_level": 8, "babel_rating": 8.5 },
          "civilization_context": { "region": "东亚", "cultural_sphere": "汉字文化圈", "historical_context": "战国至汉代，中国医学系统化", "contemporary_works": ["伤寒杂病论", "神农本草经"], "predecessors": ["早期医学经验", "阴阳五行理论"], "successors": ["中医传统", "东亚医学"] },
          "thematic_tags": [{ "tag": "医学", "weight": 0.9 }, { "tag": "阴阳", "weight": 0.8 }, { "tag": "五行", "weight": 0.8 }, { "tag": "预防", "weight": 0.7 }, { "tag": "整体观", "weight": 0.8 }, { "tag": "气", "weight": 0.9 }]
        },
        {
          "id": "026",
          "title_original": "九章算术",
          "title_translations": { "en": "Nine Chapters on the Mathematical Art", "zh": "九章算术" },
          "author": { "name_original": "多人", "name_latinized": "Various", "name_chinese": "多人", "lifespan": "公元1世纪", "civilization": "Han China" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约公元1世纪", "original_language": "文言文", "genre": ["数学", "实用", "教材"], "length_category": "中等", "difficulty_level": 8, "babel_rating": 8.3 },
          "civilization_context": { "region": "东亚", "cultural_sphere": "汉字文化圈", "historical_context": "汉代，中国数学系统化", "contemporary_works": ["周髀算经", "算术书"], "predecessors": ["早期数学知识"], "successors": ["孙子算经", "中国数学传统"] },
          "thematic_tags": [{ "tag": "数学", "weight": 0.9 }, { "tag": "实用", "weight": 0.8 }, { "tag": "算法", "weight": 0.7 }, { "tag": "几何", "weight": 0.7 }, { "tag": "代数", "weight": 0.7 }, { "tag": "教材", "weight": 0.8 }]
        },
        {
          "id": "027",
          "title_original": "De oratore",
          "title_translations": { "en": "On the Orator", "zh": "论演说家" },
          "author": { "name_original": "Marcus Tullius Cicero", "name_latinized": "Cicero", "name_chinese": "西塞罗", "lifespan": "公元前106-43年", "civilization": "Roman Republic" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约公元前55年", "original_language": "拉丁语", "genre": ["修辞学", "哲学", "对话"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 8.6 },
          "civilization_context": { "region": "地中海", "cultural_sphere": "罗马", "historical_context": "罗马共和国末期，内战前", "contemporary_works": ["凯撒战记", "卡图卢斯诗歌"], "predecessors": ["希腊修辞学", "罗马演说传统"], "successors": ["昆体良", "文艺复兴人文主义"] },
          "thematic_tags": [{ "tag": "修辞学", "weight": 0.9 }, { "tag": "演说", "weight": 0.9 }, { "tag": "教育", "weight": 0.7 }, { "tag": "哲学", "weight": 0.7 }, { "tag": "公民美德", "weight": 0.7 }, { "tag": "对话", "weight": 0.7 }]
        },
        {
          "id": "028",
          "title_original": "धम्मपद",
          "title_translations": { "en": "Dhammapada", "zh": "法句经" },
          "author": { "name_original": "佛教僧团", "name_latinized": "Buddhist sangha", "name_chinese": "佛教僧团", "lifespan": "公元前3世纪", "civilization": "Ancient India" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约公元前3世纪", "original_language": "巴利语", "genre": ["经文", "格言", "伦理"], "length_category": "短", "difficulty_level": 6, "babel_rating": 8.7 },
          "civilization_context": { "region": "南亚", "cultural_sphere": "印度文化圈", "historical_context": "阿育王时期，佛教结集", "contemporary_works": ["阿含经", "本生经"], "predecessors": ["佛陀教义"], "successors": ["大乘经典", "上座部传统"] },
          "thematic_tags": [{ "tag": "佛教", "weight": 0.9 }, { "tag": "伦理", "weight": 0.8 }, { "tag": "格言", "weight": 0.8 }, { "tag": "正念", "weight": 0.8 }, { "tag": "智慧", "weight": 0.8 }, { "tag": "四圣谛", "weight": 0.7 }]
        },
        {
          "id": "029",
          "title_original": "תַּלְמוּד",
          "title_translations": { "en": "Talmud", "zh": "塔木德" },
          "author": { "name_original": "拉比", "name_latinized": "Rabbis", "name_chinese": "拉比", "lifespan": "2-5世纪", "civilization": "Late Antiquity Jewish" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约2-5世纪", "original_language": "希伯来语与亚兰语", "genre": ["律法", "注释", "对话"], "length_category": "极长", "difficulty_level": 9, "babel_rating": 9.0 },
          "civilization_context": { "region": "黎凡特", "cultural_sphere": "犹太", "historical_context": "罗马帝国统治，第二圣殿毁灭后", "contemporary_works": ["教父著作", "新约"], "predecessors": ["希伯来圣经", "口传律法"], "successors": ["拉比犹太教", "犹太哲学"] },
          "thematic_tags": [{ "tag": "犹太律法", "weight": 0.9 }, { "tag": "注释", "weight": 0.8 }, { "tag": "对话", "weight": 0.8 }, { "tag": "伦理", "weight": 0.7 }, { "tag": "诠释", "weight": 0.8 }, { "tag": "口传传统", "weight": 0.8 }]
        },
        {
          "id": "030",
          "title_original": "De rerum natura",
          "title_translations": { "en": "On the Nature of Things", "zh": "物性论" },
          "author": { "name_original": "Titus Lucretius Carus", "name_latinized": "Lucretius", "name_chinese": "卢克莱修", "lifespan": "约公元前99-55年", "civilization": "Roman Republic" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约公元前1世纪", "original_language": "拉丁语", "genre": ["哲学", "诗歌", "科学"], "length_category": "长", "difficulty_level": 8, "babel_rating": 8.9 },
          "civilization_context": { "region": "地中海", "cultural_sphere": "罗马", "historical_context": "罗马共和国晚期，内战时期", "contemporary_works": ["西塞罗著作", "凯撒战记"], "predecessors": ["伊壁鸠鲁", "希腊哲学诗"], "successors": ["文艺复兴自然哲学", "启蒙唯物主义"] },
          "thematic_tags": [{ "tag": "伊壁鸠鲁主义", "weight": 0.9 }, { "tag": "原子论", "weight": 0.8 }, { "tag": "唯物主义", "weight": 0.9 }, { "tag": "科学诗", "weight": 0.8 }, { "tag": "死亡恐惧", "weight": 0.8 }, { "tag": "自然世界", "weight": 0.8 }]
        },
        {
          "id": "031",
          "title_original": "मेघदूत",
          "title_translations": { "en": "Meghaduta", "zh": "云使" },
          "author": { "name_original": "कालिदास", "name_latinized": "Kalidasa", "name_chinese": "迦梨陀娑", "lifespan": "4-5世纪", "civilization": "Gupta India" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约4-5世纪", "original_language": "梵语", "genre": ["诗歌", "抒情", "信使诗"], "length_category": "短", "difficulty_level": 7, "babel_rating": 8.8 },
          "civilization_context": { "region": "南亚", "cultural_sphere": "印度文化圈", "historical_context": "笈多王朝，印度古典黄金时代", "contemporary_works": ["沙恭达罗", "鸠摩罗出世"], "predecessors": ["梵语文学", "往世书"], "successors": ["古典梵语诗歌", "区域语言文学"] },
          "thematic_tags": [{ "tag": "诗歌", "weight": 0.9 }, { "tag": "爱情", "weight": 0.8 }, { "tag": "离别", "weight": 0.8 }, { "tag": "自然", "weight": 0.8 }, { "tag": "信使诗", "weight": 0.7 }, { "tag": "古典梵语", "weight": 0.8 }]
        },
        {
          "id": "032",
          "title_original": "昭明文选",
          "title_translations": { "en": "Selections of Refined Literature", "zh": "文选" },
          "author": { "name_original": "萧统编", "name_latinized": "Compiled by Xiao Tong", "name_chinese": "萧统编", "lifespan": "501-531年", "civilization": "Six Dynasties China" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约530年", "original_language": "文言文", "genre": ["文集", "文学", "诗歌"], "length_category": "极长", "difficulty_level": 8, "babel_rating": 8.4 },
          "civilization_context": { "region": "东亚", "cultural_sphere": "汉字文化圈", "historical_context": "南朝梁代，中国文学自觉时期", "contemporary_works": ["文心雕龙", "诗品"], "predecessors": ["汉赋", "魏晋文学"], "successors": ["唐代文学", "科举考试文学"] },
          "thematic_tags": [{ "tag": "文集", "weight": 0.9 }, { "tag": "文学", "weight": 0.9 }, { "tag": "诗歌", "weight": 0.8 }, { "tag": "散文", "weight": 0.8 }, { "tag": "雅致", "weight": 0.7 }, { "tag": "经典形成", "weight": 0.8 }]
        },
        {
          "id": "033",
          "title_original": "Corpus Juris Civilis",
          "title_translations": { "en": "Corpus Juris Civilis", "zh": "查士丁尼法典" },
          "author": { "name_original": "查士丁尼一世委员会", "name_latinized": "Commission of Justinian I", "name_chinese": "查士丁尼一世委员会", "lifespan": "483-565年", "civilization": "Byzantine Empire" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约529-534年", "original_language": "拉丁语", "genre": ["法律", "法典", "法学"], "length_category": "极长", "difficulty_level": 9, "babel_rating": 8.9 },
          "civilization_context": { "region": "地中海", "cultural_sphere": "拜占庭", "historical_context": "拜占庭帝国，罗马法系统化", "contemporary_works": ["狄奥多西法典", "拜占庭历史著作"], "predecessors": ["罗马法", "古典法学"], "successors": ["中世纪罗马法", "现代民法传统"] },
          "thematic_tags": [{ "tag": "法律", "weight": 0.9 }, { "tag": "法学", "weight": 0.9 }, { "tag": "法典化", "weight": 0.8 }, { "tag": "罗马法", "weight": 0.9 }, { "tag": "皇权", "weight": 0.7 }, { "tag": "法律体系", "weight": 0.9 }]
        },
        {
          "id": "034",
          "title_original": "De civitate Dei",
          "title_translations": { "en": "City of God", "zh": "上帝之城" },
          "author": { "name_original": "Aurelius Augustinus", "name_latinized": "Augustine of Hippo", "name_chinese": "奥古斯丁", "lifespan": "354-430年", "civilization": "Late Roman Empire" },
          "metadata": { "period": "古典帝国期", "estimated_date": "约413-426年", "original_language": "拉丁语", "genre": ["神学", "哲学", "护教学"], "length_category": "长", "difficulty_level": 8, "babel_rating": 9.4 },
          "civilization_context": { "region": "北非", "cultural_sphere": "基督教", "historical_context": "罗马帝国衰落，蛮族入侵，基督教成为国教", "contemporary_works": ["忏悔录", "其他教父著作"], "predecessors": ["柏拉图", "新约", "早期基督教神学"], "successors": ["中世纪神学", "宗教改革神学"] },
          "thematic_tags": [{ "tag": "神学", "weight": 0.9 }, { "tag": "两城论", "weight": 0.9 }, { "tag": "神意", "weight": 0.8 }, { "tag": "历史", "weight": 0.7 }, { "tag": "恩典", "weight": 0.8 }, { "tag": "护教", "weight": 0.7 }]
        }
      ]
    },
    "medieval_transition": {
      "period_name": "中世纪转型期",
      "era": "中世纪",
      "time_range": "约500 - 1500年",
      "description": "后帝国时代，宗教文明主导，跨区域网络形成，文艺复兴准备期",
      "key_characteristics": ["宗教文明", "手稿文化", "经院哲学", "丝绸之路网络"],
      "total_books": 15,
      "books": [
        {
          "id": "035",
          "title_original": "القرآن",
          "title_translations": { "en": "Quran", "zh": "古兰经" },
          "author": { "name_original": "محمد (ناقل الوحي)", "name_latinized": "Muhammad (recipient of revelation)", "name_chinese": "穆罕默德", "lifespan": "570-632年", "civilization": "Arabian" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "610-632年（启示），650年（定本）", "original_language": "古典阿拉伯语", "genre": ["经文", "启示", "诗歌", "律法"], "length_category": "中等", "difficulty_level": 9, "babel_rating": 9.9 },
          "civilization_context": { "region": "阿拉伯半岛", "cultural_sphere": "伊斯兰", "historical_context": "前伊斯兰阿拉伯，伊斯兰兴起", "contemporary_works": ["圣训", "早期伊斯兰文献"], "predecessors": ["希伯来圣经", "基督教新约", "阿拉伯诗歌"], "successors": ["伊斯兰法", "苏菲主义", "伊斯兰哲学"] },
          "thematic_tags": [{ "tag": "一神论", "weight": 1.0 }, { "tag": "启示", "weight": 0.9 }, { "tag": "律法", "weight": 0.8 }, { "tag": "末世论", "weight": 0.7 }, { "tag": "伦理", "weight": 0.8 }, { "tag": "阿拉伯文学", "weight": 0.9 }]
        },
        {
          "id": "036",
          "title_original": "الحديث",
          "title_translations": { "en": "Hadith", "zh": "圣训" },
          "author": { "name_original": "先知穆罕默德", "name_latinized": "Prophet Muhammad", "name_chinese": "穆罕默德", "lifespan": "570-632年", "civilization": "Arabian" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "8-9世纪（汇编）", "original_language": "阿拉伯语", "genre": ["传统", "律法", "传记"], "length_category": "极长", "difficulty_level": 8, "babel_rating": 9.2 },
          "civilization_context": { "region": "阿拉伯半岛", "cultural_sphere": "伊斯兰", "historical_context": "伊斯兰早期，圣训收集与甄别", "contemporary_works": ["古兰经注释", "早期伊斯兰法学"], "predecessors": ["古兰经", "阿拉伯口传传统"], "successors": ["伊斯兰法学派", "圣训学"] },
          "thematic_tags": [{ "tag": "先知训言", "weight": 0.9 }, { "tag": "律法", "weight": 0.8 }, { "tag": "伦理", "weight": 0.8 }, { "tag": "传记", "weight": 0.7 }, { "tag": "逊奈", "weight": 0.9 }, { "tag": "伊斯兰法", "weight": 0.8 }]
        },
        {
          "id": "037",
          "title_original": "源氏物語",
          "title_translations": { "en": "The Tale of Genji", "zh": "源氏物语" },
          "author": { "name_original": "紫式部", "name_latinized": "Murasaki Shikibu", "name_chinese": "紫式部", "lifespan": "约973-1014年", "civilization": "Heian Japan" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "约1000-1012年", "original_language": "日语", "genre": ["小说", "爱情", "宫廷生活"], "length_category": "极长", "difficulty_level": 7, "babel_rating": 9.5 },
          "civilization_context": { "region": "东亚", "cultural_sphere": "日本", "historical_context": "平安时代，日本宫廷文化鼎盛", "contemporary_works": ["枕草子", "和歌集"], "predecessors": ["日本诗歌", "中国文学影响"], "successors": ["日本古典文学", "能剧"] },
          "thematic_tags": [{ "tag": "小说", "weight": 0.9 }, { "tag": "宫廷生活", "weight": 0.9 }, { "tag": "爱情", "weight": 0.8 }, { "tag": "美学", "weight": 0.8 }, { "tag": "物哀", "weight": 0.8 }, { "tag": "心理描写", "weight": 0.7 }]
        },
        {
          "id": "038",
          "title_original": "Divina Commedia",
          "title_translations": { "en": "Divine Comedy", "zh": "神曲" },
          "author": { "name_original": "Dante Alighieri", "name_latinized": "Dante", "name_chinese": "但丁", "lifespan": "1265-1321年", "civilization": "Medieval Italy" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "约1308-1320年", "original_language": "意大利语", "genre": ["史诗", "寓言", "神学"], "length_category": "长", "difficulty_level": 8, "babel_rating": 9.4 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "西方基督教", "historical_context": "中世纪晚期意大利，教权与皇权斗争", "contemporary_works": ["托马斯·阿奎那著作", "乔托艺术"], "predecessors": ["维吉尔", "基督教神学", "宫廷爱情诗歌"], "successors": ["文艺复兴文学", "现代意大利语"] },
          "thematic_tags": [{ "tag": "来世", "weight": 0.9 }, { "tag": "救赎", "weight": 0.8 }, { "tag": "政治寓言", "weight": 0.7 }, { "tag": "爱情", "weight": 0.8 }, { "tag": "流亡", "weight": 0.6 }, { "tag": "俗语文学", "weight": 0.9 }]
        },
        {
          "id": "039",
          "title_original": "ألف ليلة وليلة",
          "title_translations": { "en": "One Thousand and One Nights", "zh": "一千零一夜" },
          "author": { "name_original": "多人", "name_latinized": "Various", "name_chinese": "多人", "lifespan": "8-16世纪", "civilization": "Islamic World" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "约8-16世纪", "original_language": "阿拉伯语", "genre": ["故事", "民间文学", "框式叙事"], "length_category": "极长", "difficulty_level": 6, "babel_rating": 8.8 },
          "civilization_context": { "region": "中东", "cultural_sphere": "伊斯兰", "historical_context": "伊斯兰黄金时代，跨文化故事交流", "contemporary_works": ["卡里莱和迪木乃", "波斯诗歌"], "predecessors": ["波斯故事", "印度故事", "阿拉伯民间故事"], "successors": ["欧洲文学影响", "现代儿童文学"] },
          "thematic_tags": [{ "tag": "故事", "weight": 0.9 }, { "tag": "框式叙事", "weight": 0.8 }, { "tag": "民间文学", "weight": 0.8 }, { "tag": "魔法", "weight": 0.7 }, { "tag": "智慧", "weight": 0.7 }, { "tag": "跨文化", "weight": 0.8 }]
        },
        {
          "id": "040",
          "title_original": "Le Roman de la Rose",
          "title_translations": { "en": "Romance of the Rose", "zh": "玫瑰传奇" },
          "author": { "name_original": "Guillaume de Lorris & Jean de Meun", "name_latinized": "Guillaume de Lorris & Jean de Meun", "name_chinese": "纪尧姆·德·洛里斯 与 让·德·默恩", "lifespan": "13世纪", "civilization": "Medieval France" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "约1230-1275年", "original_language": "古法语", "genre": ["寓言", "诗歌", "宫廷爱情"], "length_category": "长", "difficulty_level": 7, "babel_rating": 8.3 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "西方基督教", "historical_context": "中世纪盛期法国，宫廷文化", "contemporary_works": ["亚瑟王传奇", "吟游诗人诗歌"], "predecessors": ["奥维德", "拉丁寓言"], "successors": ["乔叟", "文艺复兴爱情诗歌"] },
          "thematic_tags": [{ "tag": "寓言", "weight": 0.9 }, { "tag": "宫廷爱情", "weight": 0.9 }, { "tag": "梦景", "weight": 0.7 }, { "tag": "爱情辩论", "weight": 0.7 }, { "tag": "中世纪诗歌", "weight": 0.8 }, { "tag": "俗语", "weight": 0.7 }]
        },
        {
          "id": "041",
          "title_original": "Il Milione",
          "title_translations": { "en": "The Travels of Marco Polo", "zh": "马可·波罗游记" },
          "author": { "name_original": "Marco Polo", "name_latinized": "Marco Polo", "name_chinese": "马可·波罗", "lifespan": "1254-1324年", "civilization": "Medieval Italy" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "约1298-1299年", "original_language": "古法语", "genre": ["游记", "地理", "回忆录"], "length_category": "中等", "difficulty_level": 6, "babel_rating": 8.5 },
          "civilization_context": { "region": "欧亚", "cultural_sphere": "跨文化", "historical_context": "蒙古帝国时期，丝绸之路畅通", "contemporary_works": ["鄂多立克东游录", "拉施特史集"], "predecessors": ["古代地理志", "中世纪旅行记"], "successors": ["大航海时代文献", "欧洲东方学"] },
          "thematic_tags": [{ "tag": "旅行", "weight": 0.9 }, { "tag": "地理", "weight": 0.8 }, { "tag": "跨文化", "weight": 0.9 }, { "tag": "奇观", "weight": 0.7 }, { "tag": "东西方", "weight": 0.9 }, { "tag": "探索", "weight": 0.8 }]
        },
        {
          "id": "042",
          "title_original": "大唐西域记",
          "title_translations": { "en": "Great Tang Records on the Western Regions", "zh": "大唐西域记" },
          "author": { "name_original": "玄奘", "name_latinized": "Xuanzang", "name_chinese": "玄奘", "lifespan": "602-664年", "civilization": "Tang China" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "约646年", "original_language": "文言文", "genre": ["游记", "地理", "佛学"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 8.4 },
          "civilization_context": { "region": "亚洲", "cultural_sphere": "汉字文化圈", "historical_context": "唐代，中国与中亚交流频繁", "contemporary_works": ["往五天竺国传", "经行记"], "predecessors": ["法显传", "汉代西域记载"], "successors": ["宋云行记", "东亚佛教地理志"] },
          "thematic_tags": [{ "tag": "旅行", "weight": 0.9 }, { "tag": "佛教", "weight": 0.8 }, { "tag": "中亚", "weight": 0.8 }, { "tag": "朝圣", "weight": 0.8 }, { "tag": "地理", "weight": 0.8 }, { "tag": "文化交流", "weight": 0.8 }]
        },
        {
          "id": "043",
          "title_original": "Στοιχεῖα",
          "title_translations": { "en": "Elements", "zh": "几何原本" },
          "author": { "name_original": "Εὐκλείδης", "name_latinized": "Euclid", "name_chinese": "欧几里得", "lifespan": "约公元前300年", "civilization": "Hellenistic" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "约公元前300年", "original_language": "古希腊语", "genre": ["数学", "几何", "教材"], "length_category": "长", "difficulty_level": 8, "babel_rating": 9.3 },
          "civilization_context": { "region": "地中海", "cultural_sphere": "希腊化", "historical_context": "希腊化时期，亚历山大城学术", "contemporary_works": ["阿基米德著作", "阿波罗尼奥斯"], "predecessors": ["毕达哥拉斯学派", "柏拉图学园"], "successors": ["阿拉伯数学", "中世纪欧洲数学"] },
          "thematic_tags": [{ "tag": "几何", "weight": 0.9 }, { "tag": "数学", "weight": 0.9 }, { "tag": "公理化", "weight": 0.9 }, { "tag": "证明", "weight": 0.9 }, { "tag": "教材", "weight": 0.8 }, { "tag": "演绎", "weight": 0.9 }]
        },
        {
          "id": "044",
          "title_original": "القانون في الطب",
          "title_translations": { "en": "The Canon of Medicine", "zh": "医典" },
          "author": { "name_original": "ابن سينا", "name_latinized": "Avicenna (Ibn Sina)", "name_chinese": "伊本·西拿（阿维森纳）", "lifespan": "980-1037年", "civilization": "Islamic Persia" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "约1025年", "original_language": "阿拉伯语", "genre": ["医学", "百科全书", "哲学"], "length_category": "极长", "difficulty_level": 9, "babel_rating": 9.1 },
          "civilization_context": { "region": "波斯", "cultural_sphere": "伊斯兰", "historical_context": "伊斯兰黄金时代，科学哲学繁荣", "contemporary_works": ["治疗论", "指示与诠明之书"], "predecessors": ["盖伦", "亚里士多德", "印度医学"], "successors": ["欧洲中世纪医学", "文艺复兴医学"] },
          "thematic_tags": [{ "tag": "医学", "weight": 0.9 }, { "tag": "百科全书", "weight": 0.9 }, { "tag": "哲学", "weight": 0.7 }, { "tag": "系统性", "weight": 0.9 }, { "tag": "盖伦体系", "weight": 0.8 }, { "tag": "伊斯兰科学", "weight": 0.8 }]
        },
        {
          "id": "045",
          "title_original": "بداية المجتهد",
          "title_translations": { "en": "The Distinguished Jurist's Primer", "zh": "法理汇要" },
          "author": { "name_original": "ابن رشد", "name_latinized": "Averroes (Ibn Rushd)", "name_chinese": "伊本·鲁世德（阿威罗伊）", "lifespan": "1126-1198年", "civilization": "Al-Andalus" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "约12世纪", "original_language": "阿拉伯语", "genre": ["法律", "法学", "比较"], "length_category": "长", "difficulty_level": 8, "babel_rating": 8.7 },
          "civilization_context": { "region": "伊比利亚半岛", "cultural_sphere": "伊斯兰", "historical_context": "安达卢斯，伊斯兰西班牙繁荣期", "contemporary_works": ["矛盾的矛盾", "亚里士多德注释"], "predecessors": ["马立克学派", "沙斐仪学派"], "successors": ["欧洲经院哲学", "伊斯兰法学"] },
          "thematic_tags": [{ "tag": "伊斯兰法", "weight": 0.9 }, { "tag": "法学", "weight": 0.8 }, { "tag": "比较", "weight": 0.8 }, { "tag": "法律推理", "weight": 0.8 }, { "tag": "马立克派", "weight": 0.7 }, { "tag": "哲法结合", "weight": 0.7 }]
        },
        {
          "id": "046",
          "title_original": "大学",
          "title_translations": { "en": "Great Learning", "zh": "大学" },
          "author": { "name_original": "曾子等", "name_latinized": "Attributed to Zengzi et al.", "name_chinese": "曾子等", "lifespan": "前5-前3世纪", "civilization": "Ancient China" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "约前5-前3世纪（原文），11-12世纪（四书重组）", "original_language": "文言文", "genre": ["哲学", "伦理", "教育"], "length_category": "短", "difficulty_level": 7, "babel_rating": 8.5 },
          "civilization_context": { "region": "东亚", "cultural_sphere": "汉字文化圈", "historical_context": "宋代新儒学运动，四书确立", "contemporary_works": ["中庸", "近思录"], "predecessors": ["礼记", "早期儒学"], "successors": ["朱子学", "东亚儒家教育"] },
          "thematic_tags": [{ "tag": "儒家", "weight": 0.9 }, { "tag": "修身", "weight": 0.9 }, { "tag": "治国", "weight": 0.8 }, { "tag": "教育", "weight": 0.8 }, { "tag": "道德培养", "weight": 0.8 }, { "tag": "理学", "weight": 0.8 }]
        },
        {
          "id": "047",
          "title_original": "古事記",
          "title_translations": { "en": "Records of Ancient Matters", "zh": "古事记" },
          "author": { "name_original": "太安万侣", "name_latinized": "Ō no Yasumaro", "name_chinese": "太安万侣", "lifespan": "7-8世纪", "civilization": "Nara Japan" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "约712年", "original_language": "日语", "genre": ["神话", "历史", "神道"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 8.2 },
          "civilization_context": { "region": "东亚", "cultural_sphere": "日本", "historical_context": "奈良时代，日本国家形成", "contemporary_works": ["日本书纪", "风土记"], "predecessors": ["口传神话", "氏族传说"], "successors": ["日本神话体系", "神道教经典"] },
          "thematic_tags": [{ "tag": "神话", "weight": 0.9 }, { "tag": "神道", "weight": 0.8 }, { "tag": "起源", "weight": 0.8 }, { "tag": "皇统", "weight": 0.7 }, { "tag": "历史", "weight": 0.7 }, { "tag": "日本认同", "weight": 0.8 }]
        },
        {
          "id": "048",
          "title_original": "La Chanson de Roland",
          "title_translations": { "en": "Song of Roland", "zh": "罗兰之歌" },
          "author": { "name_original": "匿名", "name_latinized": "Anonymous", "name_chinese": "佚名", "lifespan": "11世纪", "civilization": "Medieval France" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "约11世纪", "original_language": "古法语", "genre": ["史诗", "诗歌", "武功歌"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 8.4 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "西方基督教", "historical_context": "中世纪法国，查理曼帝国记忆", "contemporary_works": ["其他武功歌", "十字军编年史"], "predecessors": ["日耳曼史诗", "拉丁史诗"], "successors": ["骑士文学", "民族史诗"] },
          "thematic_tags": [{ "tag": "史诗", "weight": 0.9 }, { "tag": "骑士精神", "weight": 0.8 }, { "tag": "基督-穆斯林", "weight": 0.7 }, { "tag": "忠诚", "weight": 0.8 }, { "tag": "英雄主义", "weight": 0.8 }, { "tag": "民族认同", "weight": 0.7 }]
        },
        {
          "id": "049",
          "title_original": "شاهنامه",
          "title_translations": { "en": "Shahnameh", "zh": "列王纪" },
          "author": { "name_original": "فردوسی", "name_latinized": "Ferdowsi", "name_chinese": "菲尔多西", "lifespan": "940-1020年", "civilization": "Persian" },
          "metadata": { "period": "中世纪转型期", "estimated_date": "约977-1010年", "original_language": "波斯语", "genre": ["史诗", "诗歌", "历史"], "length_category": "极长", "difficulty_level": 7, "babel_rating": 9.2 },
          "civilization_context": { "region": "波斯", "cultural_sphere": "波斯", "historical_context": "伊斯兰时期波斯，波斯文化复兴", "contemporary_works": ["王书散文版", "波斯诗歌繁荣"], "predecessors": ["巴列维语史书", "波斯神话"], "successors": ["波斯文学传统", "波斯民族认同"] },
          "thematic_tags": [{ "tag": "史诗", "weight": 0.9 }, { "tag": "波斯历史", "weight": 0.8 }, { "tag": "神话", "weight": 0.8 }, { "tag": "民族认同", "weight": 0.9 }, { "tag": "英雄主义", "weight": 0.8 }, { "tag": "波斯语言", "weight": 0.9 }]
        }
      ]
    },
    "modern_turn": {
      "period_name": "近代转折期",
      "era": "近代",
      "time_range": "约1500 - 1900年",
      "description": "全球联系加强，科学革命，启蒙运动，现代性形成",
      "key_characteristics": ["科学革命", "启蒙理性", "民族国家", "工业革命"],
      "total_books": 26,
      "books": [
        {
          "id": "050",
          "title_original": "Il Principe",
          "title_translations": { "en": "The Prince", "zh": "君主论" },
          "author": { "name_original": "Niccolò Machiavelli", "name_latinized": "Machiavelli", "name_chinese": "尼可罗·马基雅维利", "lifespan": "1469-1527年", "civilization": "Renaissance Italy" },
          "metadata": { "period": "近代转折期", "estimated_date": "1513年（撰写），1532年（出版）", "original_language": "意大利语", "genre": ["政治理论", "治国指南", "论著"], "length_category": "短", "difficulty_level": 7, "babel_rating": 9.1 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "意大利文艺复兴", "historical_context": "意大利战争，美第奇统治，人文主义", "contemporary_works": ["廷臣论", "乌托邦", "伊拉斯谟著作"], "predecessors": ["罗马历史学家", "中世纪君主镜鉴文学"], "successors": ["现代政治科学", "现实主义国际关系"] },
          "thematic_tags": [{ "tag": "政治现实主义", "weight": 0.9 }, { "tag": "权力", "weight": 0.9 }, { "tag": "德性", "weight": 0.8 }, { "tag": "命运", "weight": 0.7 }, { "tag": "治国术", "weight": 0.8 }, { "tag": "道德模糊", "weight": 0.7 }]
        },
        {
          "id": "051",
          "title_original": "De revolutionibus orbium coelestium",
          "title_translations": { "en": "On the Revolutions of the Heavenly Spheres", "zh": "天体运行论" },
          "author": { "name_original": "Mikołaj Kopernik", "name_latinized": "Nicolaus Copernicus", "name_chinese": "尼古拉·哥白尼", "lifespan": "1473-1543年", "civilization": "Renaissance Poland" },
          "metadata": { "period": "近代转折期", "estimated_date": "1543年", "original_language": "拉丁语", "genre": ["天文学", "科学", "宇宙论"], "length_category": "中等", "difficulty_level": 9, "babel_rating": 9.4 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "文艺复兴", "historical_context": "文艺复兴晚期，宗教改革时期", "contemporary_works": ["路德著作", "加尔文著作"], "predecessors": ["托勒密天文学", "阿拉伯天文学", "希腊天文学"], "successors": ["开普勒", "伽利略", "科学革命"] },
          "thematic_tags": [{ "tag": "日心说", "weight": 0.9 }, { "tag": "天文学", "weight": 0.9 }, { "tag": "宇宙论", "weight": 0.8 }, { "tag": "科学革命", "weight": 0.9 }, { "tag": "数学", "weight": 0.8 }, { "tag": "范式转移", "weight": 0.9 }]
        },
        {
          "id": "052",
          "title_original": "Complete Works",
          "title_translations": { "en": "Complete Works of Shakespeare", "zh": "莎士比亚全集" },
          "author": { "name_original": "William Shakespeare", "name_latinized": "Shakespeare", "name_chinese": "威廉·莎士比亚", "lifespan": "1564-1616年", "civilization": "Elizabethan England" },
          "metadata": { "period": "近代转折期", "estimated_date": "1589-1613年", "original_language": "英语", "genre": ["戏剧", "诗歌", "十四行诗"], "length_category": "极长", "difficulty_level": 7, "babel_rating": 9.8 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "英国", "historical_context": "伊丽莎白时代和詹姆士一世时期，英国文艺复兴", "contemporary_works": ["马洛戏剧", "本·琼森戏剧"], "predecessors": ["古希腊悲剧", "罗马喜剧", "中世纪道德剧"], "successors": ["英语文学传统", "全球戏剧"] },
          "thematic_tags": [{ "tag": "戏剧", "weight": 0.9 }, { "tag": "人性", "weight": 0.9 }, { "tag": "语言", "weight": 0.9 }, { "tag": "悲剧", "weight": 0.8 }, { "tag": "喜剧", "weight": 0.8 }, { "tag": "历史", "weight": 0.7 }]
        },
        {
          "id": "053",
          "title_original": "Don Quijote de la Mancha",
          "title_translations": { "en": "Don Quixote", "zh": "堂吉诃德" },
          "author": { "name_original": "Miguel de Cervantes Saavedra", "name_latinized": "Cervantes", "name_chinese": "米格尔·德·塞万提斯", "lifespan": "1547-1616年", "civilization": "Spanish Golden Age" },
          "metadata": { "period": "近代转折期", "estimated_date": "1605年（第一部），1615年（第二部）", "original_language": "西班牙语", "genre": ["小说", "讽刺", "流浪汉小说"], "length_category": "长", "difficulty_level": 7, "babel_rating": 9.6 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "西班牙", "historical_context": "西班牙黄金时代，反宗教改革", "contemporary_works": ["洛佩·德·维加戏剧", "流浪汉小说"], "predecessors": ["骑士小说", "意大利文艺复兴文学"], "successors": ["现代小说", "后现代文学"] },
          "thematic_tags": [{ "tag": "小说", "weight": 0.9 }, { "tag": "讽刺", "weight": 0.8 }, { "tag": "疯狂", "weight": 0.8 }, { "tag": "现实与幻想", "weight": 0.8 }, { "tag": "骑士精神", "weight": 0.8 }, { "tag": "现代小说", "weight": 0.9 }]
        },
        {
          "id": "054",
          "title_original": "Leviathan",
          "title_translations": { "en": "Leviathan", "zh": "利维坦" },
          "author": { "name_original": "Thomas Hobbes", "name_latinized": "Hobbes", "name_chinese": "托马斯·霍布斯", "lifespan": "1588-1679年", "civilization": "17th century England" },
          "metadata": { "period": "近代转折期", "estimated_date": "1651年", "original_language": "英语", "genre": ["政治哲学", "社会契约", "论著"], "length_category": "长", "difficulty_level": 8, "babel_rating": 9.3 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "英国", "historical_context": "英国内战，共和国时期", "contemporary_works": ["弥尔顿著作", "哈林顿著作"], "predecessors": ["马基雅维利", "博丹", "格劳秀斯"], "successors": ["洛克", "卢梭", "现代政治哲学"] },
          "thematic_tags": [{ "tag": "社会契约", "weight": 0.9 }, { "tag": "主权", "weight": 0.9 }, { "tag": "自然状态", "weight": 0.9 }, { "tag": "专制主义", "weight": 0.8 }, { "tag": "人性", "weight": 0.8 }, { "tag": "政治秩序", "weight": 0.9 }]
        },
        {
          "id": "055",
          "title_original": "Discours de la méthode",
          "title_translations": { "en": "Discourse on the Method", "zh": "方法论" },
          "author": { "name_original": "René Descartes", "name_latinized": "Descartes", "name_chinese": "勒内·笛卡尔", "lifespan": "1596-1650年", "civilization": "17th century France" },
          "metadata": { "period": "近代转折期", "estimated_date": "1637年", "original_language": "法语", "genre": ["哲学", "方法论", "自传"], "length_category": "短", "difficulty_level": 7, "babel_rating": 9.2 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "法国", "historical_context": "三十年战争，科学革命早期", "contemporary_works": ["伽利略著作", "培根著作"], "predecessors": ["怀疑论传统", "数学", "经院哲学"], "successors": ["斯宾诺莎", "莱布尼茨", "启蒙运动"] },
          "thematic_tags": [{ "tag": "理性主义", "weight": 0.9 }, { "tag": "怀疑", "weight": 0.9 }, { "tag": "我思", "weight": 0.9 }, { "tag": "方法", "weight": 0.9 }, { "tag": "确定性", "weight": 0.8 }, { "tag": "近代哲学", "weight": 0.9 }]
        },
        {
          "id": "056",
          "title_original": "Ethica",
          "title_translations": { "en": "Ethics", "zh": "伦理学" },
          "author": { "name_original": "Baruch Spinoza", "name_latinized": "Spinoza", "name_chinese": "巴鲁赫·斯宾诺莎", "lifespan": "1632-1677年", "civilization": "Dutch Republic" },
          "metadata": { "period": "近代转折期", "estimated_date": "1677年（死后出版）", "original_language": "拉丁语", "genre": ["哲学", "伦理", "形而上学"], "length_category": "中等", "difficulty_level": 9, "babel_rating": 9.5 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "荷兰", "historical_context": "荷兰黄金时代，宗教宽容实验", "contemporary_works": ["洛克著作", "莱布尼茨著作"], "predecessors": ["笛卡尔", "犹太哲学", "斯多葛主义"], "successors": ["德国唯心主义", "启蒙无神论", "现代圣经批评"] },
          "thematic_tags": [{ "tag": "伦理", "weight": 0.9 }, { "tag": "泛神论", "weight": 0.9 }, { "tag": "决定论", "weight": 0.8 }, { "tag": "几何学方法", "weight": 0.8 }, { "tag": "实体", "weight": 0.9 }, { "tag": "理性神学", "weight": 0.8 }]
        },
        {
          "id": "057",
          "title_original": "Philosophiæ Naturalis Principia Mathematica",
          "title_translations": { "en": "Mathematical Principles of Natural Philosophy", "zh": "自然哲学的数学原理" },
          "author": { "name_original": "Isaac Newton", "name_latinized": "Newton", "name_chinese": "艾萨克·牛顿", "lifespan": "1643-1727年", "civilization": "17th-18th century England" },
          "metadata": { "period": "近代转折期", "estimated_date": "1687年", "original_language": "拉丁语", "genre": ["物理学", "数学", "科学"], "length_category": "长", "difficulty_level": 9, "babel_rating": 9.7 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "英国", "historical_context": "科学革命顶峰，启蒙运动前夕", "contemporary_works": ["莱布尼茨微积分", "波义耳著作"], "predecessors": ["伽利略", "开普勒", "笛卡尔"], "successors": ["经典物理学", "启蒙科学", "工业革命"] },
          "thematic_tags": [{ "tag": "物理学", "weight": 0.9 }, { "tag": "数学", "weight": 0.9 }, { "tag": "力学", "weight": 0.9 }, { "tag": "引力", "weight": 0.9 }, { "tag": "科学方法", "weight": 0.8 }, { "tag": "科学革命", "weight": 0.9 }]
        },
        {
          "id": "058",
          "title_original": "Two Treatises of Government",
          "title_translations": { "en": "Two Treatises of Government", "zh": "政府论" },
          "author": { "name_original": "John Locke", "name_latinized": "Locke", "name_chinese": "约翰·洛克", "lifespan": "1632-1704年", "civilization": "17th century England" },
          "metadata": { "period": "近代转折期", "estimated_date": "1689年", "original_language": "英语", "genre": ["政治哲学", "自由主义", "论著"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 9.3 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "英国", "historical_context": "光荣革命，权利法案", "contemporary_works": ["牛顿原理", "英国经验主义"], "predecessors": ["霍布斯", "胡克", "自然法传统"], "successors": ["启蒙运动", "美国革命", "自由主义传统"] },
          "thematic_tags": [{ "tag": "自由主义", "weight": 0.9 }, { "tag": "自然权利", "weight": 0.9 }, { "tag": "财产权", "weight": 0.8 }, { "tag": "同意", "weight": 0.8 }, { "tag": "有限政府", "weight": 0.9 }, { "tag": "社会契约", "weight": 0.8 }]
        },
        {
          "id": "059",
          "title_original": "A Treatise of Human Nature",
          "title_translations": { "en": "A Treatise of Human Nature", "zh": "人性论" },
          "author": { "name_original": "David Hume", "name_latinized": "Hume", "name_chinese": "大卫·休谟", "lifespan": "1711-1776年", "civilization": "18th century Scotland" },
          "metadata": { "period": "近代转折期", "estimated_date": "1739-1740年", "original_language": "英语", "genre": ["哲学", "经验主义", "心理学"], "length_category": "长", "difficulty_level": 8, "babel_rating": 9.4 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "苏格兰启蒙", "historical_context": "苏格兰启蒙运动，大不列颠形成", "contemporary_works": ["亚当·斯密早期著作", "里德著作"], "predecessors": ["洛克", "贝克莱", "法国怀疑论"], "successors": ["康德", "实证主义", "分析哲学"] },
          "thematic_tags": [{ "tag": "经验主义", "weight": 0.9 }, { "tag": "怀疑论", "weight": 0.8 }, { "tag": "人性", "weight": 0.9 }, { "tag": "因果", "weight": 0.8 }, { "tag": "道德", "weight": 0.8 }, { "tag": "启蒙", "weight": 0.8 }]
        },
        {
          "id": "060",
          "title_original": "Encyclopédie",
          "title_translations": { "en": "Encyclopedia", "zh": "百科全书" },
          "author": { "name_original": "Denis Diderot et al.", "name_latinized": "Diderot et al.", "name_chinese": "德尼·狄德罗 等", "lifespan": "1713-1784年", "civilization": "18th century France" },
          "metadata": { "period": "近代转折期", "estimated_date": "1751-1772年", "original_language": "法语", "genre": ["百科全书", "知识", "启蒙"], "length_category": "极长", "difficulty_level": 8, "babel_rating": 9.1 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "法国启蒙", "historical_context": "启蒙运动高潮，法国大革命前", "contemporary_works": ["伏尔泰著作", "孟德斯鸠著作"], "predecessors": ["古代百科全书", "文艺复兴知识汇编"], "successors": ["现代百科全书", "知识民主化"] },
          "thematic_tags": [{ "tag": "百科全书", "weight": 0.9 }, { "tag": "知识", "weight": 0.9 }, { "tag": "启蒙", "weight": 0.9 }, { "tag": "理性", "weight": 0.9 }, { "tag": "进步", "weight": 0.8 }, { "tag": "世俗化", "weight": 0.8 }]
        },
        {
          "id": "061",
          "title_original": "Du contrat social",
          "title_translations": { "en": "The Social Contract", "zh": "社会契约论" },
          "author": { "name_original": "Jean-Jacques Rousseau", "name_latinized": "Rousseau", "name_chinese": "让-雅克·卢梭", "lifespan": "1712-1778年", "civilization": "18th century France" },
          "metadata": { "period": "近代转折期", "estimated_date": "1762年", "original_language": "法语", "genre": ["政治哲学", "社会契约", "论著"], "length_category": "短", "difficulty_level": 7, "babel_rating": 9.3 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "法国启蒙", "historical_context": "启蒙运动晚期，旧制度危机", "contemporary_works": ["爱弥儿", "忏悔录"], "predecessors": ["霍布斯", "洛克", "孟德斯鸠"], "successors": ["法国大革命", "浪漫主义", "民主理论"] },
          "thematic_tags": [{ "tag": "社会契约", "weight": 0.9 }, { "tag": "公意", "weight": 0.9 }, { "tag": "民主", "weight": 0.8 }, { "tag": "自由", "weight": 0.8 }, { "tag": "不平等", "weight": 0.7 }, { "tag": "人民主权", "weight": 0.9 }]
        },
        {
          "id": "062",
          "title_original": "An Inquiry into the Nature and Causes of the Wealth of Nations",
          "title_translations": { "en": "The Wealth of Nations", "zh": "国富论" },
          "author": { "name_original": "Adam Smith", "name_latinized": "Smith", "name_chinese": "亚当·斯密", "lifespan": "1723-1790年", "civilization": "18th century Scotland" },
          "metadata": { "period": "近代转折期", "estimated_date": "1776年", "original_language": "英语", "genre": ["经济学", "政治经济学", "论著"], "length_category": "长", "difficulty_level": 8, "babel_rating": 9.5 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "苏格兰启蒙", "historical_context": "工业革命开始，美国独立", "contemporary_works": ["道德情操论", "休谟著作"], "predecessors": ["重商主义", "重农学派", "启蒙思想"], "successors": ["古典经济学", "现代经济学", "资本主义理论"] },
          "thematic_tags": [{ "tag": "经济学", "weight": 0.9 }, { "tag": "资本主义", "weight": 0.9 }, { "tag": "分工", "weight": 0.8 }, { "tag": "看不见的手", "weight": 0.9 }, { "tag": "自由市场", "weight": 0.9 }, { "tag": "政治经济学", "weight": 0.8 }]
        },
        {
          "id": "063",
          "title_original": "Kritik der reinen Vernunft",
          "title_translations": { "en": "Critique of Pure Reason", "zh": "纯粹理性批判" },
          "author": { "name_original": "Immanuel Kant", "name_latinized": "Kant", "name_chinese": "伊曼努尔·康德", "lifespan": "1724-1804年", "civilization": "18th century Prussia" },
          "metadata": { "period": "近代转折期", "estimated_date": "1781年", "original_language": "德语", "genre": ["哲学", "认识论", "形而上学"], "length_category": "长", "difficulty_level": 9, "babel_rating": 9.7 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "德国", "historical_context": "启蒙运动晚期，法国大革命前", "contemporary_works": ["其他康德批判", "歌德早期著作"], "predecessors": ["莱布尼茨", "休谟", "沃尔夫"], "successors": ["德国唯心主义", "现代哲学", "批判哲学"] },
          "thematic_tags": [{ "tag": "认识论", "weight": 0.9 }, { "tag": "形而上学", "weight": 0.9 }, { "tag": "批判", "weight": 0.9 }, { "tag": "先验", "weight": 0.9 }, { "tag": "理性", "weight": 0.9 }, { "tag": "启蒙", "weight": 0.8 }]
        },
        {
          "id": "064",
          "title_original": "Déclaration des droits de l'homme et du citoyen",
          "title_translations": { "en": "Declaration of the Rights of Man and of the Citizen", "zh": "人权宣言" },
          "author": { "name_original": "Assemblée nationale constituante", "name_latinized": "French National Constituent Assembly", "name_chinese": "法国国民制宪议会", "lifespan": "1789年", "civilization": "Revolutionary France" },
          "metadata": { "period": "近代转折期", "estimated_date": "1789年", "original_language": "法语", "genre": ["政治文件", "权利", "宣言"], "length_category": "极短", "difficulty_level": 5, "babel_rating": 9.5 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "法国大革命", "historical_context": "法国大革命爆发，旧制度终结", "contemporary_works": ["美国独立宣言", "法国革命文献"], "predecessors": ["启蒙思想", "自然权利理论", "英国权利法案"], "successors": ["现代人权观念", "国际人权法", "民主革命"] },
          "thematic_tags": [{ "tag": "人权", "weight": 0.9 }, { "tag": "平等", "weight": 0.9 }, { "tag": "自由", "weight": 0.9 }, { "tag": "革命", "weight": 0.8 }, { "tag": "公民权", "weight": 0.8 }, { "tag": "现代政治", "weight": 0.9 }]
        },
        {
          "id": "065",
          "title_original": "Phänomenologie des Geistes",
          "title_translations": { "en": "Phenomenology of Spirit", "zh": "精神现象学" },
          "author": { "name_original": "Georg Wilhelm Friedrich Hegel", "name_latinized": "Hegel", "name_chinese": "格奥尔格·威廉·弗里德里希·黑格尔", "lifespan": "1770-1831年", "civilization": "19th century Germany" },
          "metadata": { "period": "近代转折期", "estimated_date": "1807年", "original_language": "德语", "genre": ["哲学", "现象学", "辩证法"], "length_category": "长", "difficulty_level": 9, "babel_rating": 9.6 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "德国", "historical_context": "拿破仑战争，德国民族意识觉醒", "contemporary_works": ["费希特著作", "谢林著作"], "predecessors": ["康德", "斯宾诺莎", "希腊哲学"], "successors": ["马克思", "存在主义", "后黑格尔哲学"] },
          "thematic_tags": [{ "tag": "辩证法", "weight": 0.9 }, { "tag": "现象学", "weight": 0.9 }, { "tag": "精神", "weight": 0.9 }, { "tag": "历史", "weight": 0.8 }, { "tag": "自我意识", "weight": 0.8 }, { "tag": "绝对", "weight": 0.8 }]
        },
        {
          "id": "066",
          "title_original": "Pride and Prejudice",
          "title_translations": { "en": "Pride and Prejudice", "zh": "傲慢与偏见" },
          "author": { "name_original": "Jane Austen", "name_latinized": "Jane Austen", "name_chinese": "简·奥斯汀", "lifespan": "1775-1817年", "civilization": "18th-19th century Britain" },
          "metadata": { "period": "近代转折期", "estimated_date": "1813年", "original_language": "英语", "genre": ["小说", "爱情", "社会讽刺"], "length_category": "中等", "difficulty_level": 6, "babel_rating": 9.0 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "英国", "historical_context": "摄政时期英国，女性文学兴起", "contemporary_works": ["理智与情感", "爱玛"], "predecessors": ["理查逊", "菲尔丁"], "successors": ["维多利亚小说", "女性写作传统"] },
          "thematic_tags": [{ "tag": "阶级", "weight": 0.8 }, { "tag": "婚姻", "weight": 0.9 }, { "tag": "女性", "weight": 0.9 }, { "tag": "讽刺", "weight": 0.8 }, { "tag": "社会规范", "weight": 0.8 }, { "tag": "个人成长", "weight": 0.8 }]
        },
        {
          "id": "067",
          "title_original": "On the Origin of Species",
          "title_translations": { "en": "On the Origin of Species", "zh": "物种起源" },
          "author": { "name_original": "Charles Darwin", "name_latinized": "Darwin", "name_chinese": "查尔斯·达尔文", "lifespan": "1809-1882年", "civilization": "Victorian Britain" },
          "metadata": { "period": "近代转折期", "estimated_date": "1859年", "original_language": "英语", "genre": ["科学", "生物学", "理论"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 9.7 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "英国", "historical_context": "维多利亚时代，工业革命，大英帝国", "contemporary_works": ["马克思资本论", "狄更斯小说"], "predecessors": ["林奈分类法", "莱尔地质学", "马尔萨斯人口论"], "successors": ["现代进化综合", "遗传学", "生态学"] },
          "thematic_tags": [{ "tag": "进化", "weight": 0.9 }, { "tag": "自然选择", "weight": 0.9 }, { "tag": "生物学", "weight": 0.9 }, { "tag": "科学方法", "weight": 0.8 }, { "tag": "世俗化", "weight": 0.7 }, { "tag": "人类起源", "weight": 0.8 }]
        },
        {
          "id": "068",
          "title_original": "Das Kapital",
          "title_translations": { "en": "Capital", "zh": "资本论" },
          "author": { "name_original": "Karl Marx", "name_latinized": "Marx", "name_chinese": "卡尔·马克思", "lifespan": "1818-1883年", "civilization": "19th century Germany/Britain" },
          "metadata": { "period": "近代转折期", "estimated_date": "1867年（第一卷）", "original_language": "德语", "genre": ["政治经济学", "批判", "理论"], "length_category": "长", "difficulty_level": 9, "babel_rating": 9.6 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "德/英", "historical_context": "工业资本主义，工人运动兴起", "contemporary_works": ["恩格斯著作", "古典经济学"], "predecessors": ["黑格尔", "李嘉图", "空想社会主义"], "successors": ["马克思主义", "社会主义运动", "批判理论"] },
          "thematic_tags": [{ "tag": "资本主义", "weight": 0.9 }, { "tag": "政治经济学", "weight": 0.9 }, { "tag": "阶级斗争", "weight": 0.9 }, { "tag": "剩余价值", "weight": 0.8 }, { "tag": "异化", "weight": 0.8 }, { "tag": "历史唯物主义", "weight": 0.9 }]
        },
        {
          "id": "069",
          "title_original": "Война и мир",
          "title_translations": { "en": "War and Peace", "zh": "战争与和平" },
          "author": { "name_original": "Лев Николаевич Толстой", "name_latinized": "Leo Tolstoy", "name_chinese": "列夫·托尔斯泰", "lifespan": "1828-1910年", "civilization": "19th century Russia" },
          "metadata": { "period": "近代转折期", "estimated_date": "1869年", "original_language": "俄语", "genre": ["小说", "历史小说", "史诗"], "length_category": "极长", "difficulty_level": 8, "babel_rating": 9.5 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "俄罗斯", "historical_context": "俄罗斯帝国，农奴制改革后", "contemporary_works": ["陀思妥耶夫斯基作品", "屠格涅夫作品"], "predecessors": ["普希金", "果戈理", "欧洲现实主义"], "successors": ["俄罗斯文学黄金时代", "现代小说"] },
          "thematic_tags": [{ "tag": "历史小说", "weight": 0.9 }, { "tag": "战争", "weight": 0.9 }, { "tag": "家族史诗", "weight": 0.8 }, { "tag": "俄国历史", "weight": 0.8 }, { "tag": "现实主义", "weight": 0.8 }, { "tag": "历史哲学", "weight": 0.7 }]
        },
        {
          "id": "070",
          "title_original": "Die Traumdeutung",
          "title_translations": { "en": "The Interpretation of Dreams", "zh": "梦的解析" },
          "author": { "name_original": "Sigmund Freud", "name_latinized": "Freud", "name_chinese": "西格蒙德·弗洛伊德", "lifespan": "1856-1939年", "civilization": "19th-20th century Austria" },
          "metadata": { "period": "近代转折期", "estimated_date": "1899年", "original_language": "德语", "genre": ["心理学", "精神分析", "理论"], "length_category": "中等", "difficulty_level": 8, "babel_rating": 9.3 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "奥地利", "historical_context": "世纪末维也纳，现代心理学诞生", "contemporary_works": ["尼采著作", "现代主义文学"], "predecessors": ["浪漫主义", "无意识概念", "神经学"], "successors": ["精神分析运动", "现代心理学", "文化理论"] },
          "thematic_tags": [{ "tag": "精神分析", "weight": 0.9 }, { "tag": "梦", "weight": 0.9 }, { "tag": "潜意识", "weight": 0.9 }, { "tag": "性", "weight": 0.8 }, { "tag": "神经症", "weight": 0.7 }, { "tag": "自我分析", "weight": 0.7 }]
        },
        {
          "id": "071",
          "title_original": "A Vindication of the Rights of Woman",
          "title_translations": { "en": "A Vindication of the Rights of Woman", "zh": "女权辩护" },
          "author": { "name_original": "Mary Wollstonecraft", "name_latinized": "Wollstonecraft", "name_chinese": "玛丽·沃斯通克拉夫特", "lifespan": "1759-1797年", "civilization": "18th century Britain" },
          "metadata": { "period": "近代转折期", "estimated_date": "1792年", "original_language": "英语", "genre": ["女权主义", "政治理论", "论著"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 8.9 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "英国", "historical_context": "法国大革命影响，启蒙思想扩展", "contemporary_works": ["伯克著作", "潘恩著作"], "predecessors": ["启蒙哲学", "早期女性写作"], "successors": ["女权主义运动", "性别平等理论"] },
          "thematic_tags": [{ "tag": "女权主义", "weight": 0.9 }, { "tag": "女性权利", "weight": 0.9 }, { "tag": "教育", "weight": 0.8 }, { "tag": "启蒙", "weight": 0.8 }, { "tag": "理性", "weight": 0.8 }, { "tag": "性别平等", "weight": 0.9 }]
        },
        {
          "id": "072",
          "title_original": "De la démocratie en Amérique",
          "title_translations": { "en": "Democracy in America", "zh": "论美国的民主" },
          "author": { "name_original": "Alexis de Tocqueville", "name_latinized": "Tocqueville", "name_chinese": "亚历西斯·德·托克维尔", "lifespan": "1805-1859年", "civilization": "19th century France" },
          "metadata": { "period": "近代转折期", "estimated_date": "1835年（第一卷），1840年（第二卷）", "original_language": "法语", "genre": ["政治科学", "社会学", "游记"], "length_category": "长", "difficulty_level": 7, "babel_rating": 9.2 },
          "civilization_context": { "region": "欧美", "cultural_sphere": "法/美", "historical_context": "杰克逊时代美国，七月王朝法国", "contemporary_works": ["密尔著作", "美国超验主义"], "predecessors": ["孟德斯鸠", "卢梭", "美国建国文献"], "successors": ["比较政治学", "民主理论", "社会学"] },
          "thematic_tags": [{ "tag": "民主", "weight": 0.9 }, { "tag": "美国", "weight": 0.8 }, { "tag": "平等", "weight": 0.8 }, { "tag": "多数暴政", "weight": 0.7 }, { "tag": "公民社会", "weight": 0.8 }, { "tag": "比较政治", "weight": 0.8 }]
        },
        {
          "id": "073",
          "title_original": "Leaves of Grass",
          "title_translations": { "en": "Leaves of Grass", "zh": "草叶集" },
          "author": { "name_original": "Walt Whitman", "name_latinized": "Whitman", "name_chinese": "沃尔特·惠特曼", "lifespan": "1819-1892年", "civilization": "19th century America" },
          "metadata": { "period": "近代转折期", "estimated_date": "1855年（初版）", "original_language": "英语", "genre": ["诗歌", "自由诗", "美国文学"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 9.1 },
          "civilization_context": { "region": "北美", "cultural_sphere": "美国", "historical_context": "美国内战前，超验主义时期", "contemporary_works": ["爱默生著作", "梭罗著作"], "predecessors": ["英国浪漫主义", "圣经诗歌", "美国超验主义"], "successors": ["美国现代诗歌", "自由诗运动"] },
          "thematic_tags": [{ "tag": "诗歌", "weight": 0.9 }, { "tag": "自由诗", "weight": 0.9 }, { "tag": "民主", "weight": 0.8 }, { "tag": "自我", "weight": 0.8 }, { "tag": "自然", "weight": 0.8 }, { "tag": "美国认同", "weight": 0.8 }]
        },
        {
          "id": "074",
          "title_original": "Преступление и наказание",
          "title_translations": { "en": "Crime and Punishment", "zh": "罪与罚" },
          "author": { "name_original": "Фёдор Михайлович Достоевский", "name_latinized": "Fyodor Dostoevsky", "name_chinese": "费奥多尔·陀思妥耶夫斯基", "lifespan": "1821-1881年", "civilization": "19th century Russia" },
          "metadata": { "period": "近代转折期", "estimated_date": "1866年", "original_language": "俄语", "genre": ["小说", "心理", "哲学"], "length_category": "长", "difficulty_level": 8, "babel_rating": 9.4 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "俄罗斯", "historical_context": "俄罗斯改革时期，虚无主义兴起", "contemporary_works": ["托尔斯泰作品", "屠格涅夫作品"], "predecessors": ["果戈理", "普希金", "欧洲浪漫主义"], "successors": ["存在主义文学", "现代心理学小说"] },
          "thematic_tags": [{ "tag": "心理", "weight": 0.9 }, { "tag": "犯罪", "weight": 0.9 }, { "tag": "罪疚", "weight": 0.8 }, { "tag": "虚无主义", "weight": 0.8 }, { "tag": "救赎", "weight": 0.8 }, { "tag": "存在主义", "weight": 0.8 }]
        },
        {
          "id": "075",
          "title_original": "Manifest der Kommunistischen Partei",
          "title_translations": { "en": "Communist Manifesto", "zh": "共产党宣言" },
          "author": { "name_original": "Karl Marx & Friedrich Engels", "name_latinized": "Marx & Engels", "name_chinese": "卡尔·马克思 与 弗里德里希·恩格斯", "lifespan": "1848年", "civilization": "19th century Germany" },
          "metadata": { "period": "近代转折期", "estimated_date": "1848年", "original_language": "德语", "genre": ["政治宣言", "理论", "革命"], "length_category": "极短", "difficulty_level": 6, "babel_rating": 9.5 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "德国", "historical_context": "1848年革命，工人阶级运动", "contemporary_works": ["1848年革命文献", "早期社会主义著作"], "predecessors": ["空想社会主义", "黑格尔哲学", "古典经济学"], "successors": ["国际工人运动", "20世纪革命", "社会主义理论"] },
          "thematic_tags": [{ "tag": "共产主义", "weight": 0.9 }, { "tag": "革命", "weight": 0.9 }, { "tag": "阶级斗争", "weight": 0.9 }, { "tag": "无产阶级", "weight": 0.9 }, { "tag": "资产阶级", "weight": 0.8 }, { "tag": "历史唯物主义", "weight": 0.8 }]
        }
      ]
    },
    "contemporary_pluralism": {
      "period_name": "现代多元期",
      "era": "当代",
      "time_range": "约1900年 - 至今",
      "description": "全球化加速，多元文化，后现代转向，数字革命",
      "key_characteristics": ["全球化", "多元主义", "后现代批判", "技术革命"],
      "total_books": 26,
      "books": [
        {
          "id": "076",
          "title_original": "Die Grundlage der allgemeinen Relativitätstheorie",
          "title_translations": { "en": "The Foundation of the General Theory of Relativity", "zh": "相对论的基础" },
          "author": { "name_original": "Albert Einstein", "name_latinized": "Einstein", "name_chinese": "阿尔伯特·爱因斯坦", "lifespan": "1879-1955年", "civilization": "20th century Germany/Switzerland/USA" },
          "metadata": { "period": "现代多元期", "estimated_date": "1916年", "original_language": "德语", "genre": ["物理学", "理论", "科学"], "length_category": "短", "difficulty_level": 9, "babel_rating": 9.6 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "全球科学", "historical_context": "第一次世界大战，现代物理学革命", "contemporary_works": ["量子力学发展", "现代数学"], "predecessors": ["牛顿力学", "电磁理论", "相对性原理"], "successors": ["现代宇宙学", "量子场论", "现代物理学"] },
          "thematic_tags": [{ "tag": "相对论", "weight": 0.9 }, { "tag": "物理学", "weight": 0.9 }, { "tag": "时空", "weight": 0.9 }, { "tag": "引力", "weight": 0.9 }, { "tag": "现代科学", "weight": 0.9 }, { "tag": "范式转移", "weight": 0.9 }]
        },
        {
          "id": "077",
          "title_original": "Ulysses",
          "title_translations": { "en": "Ulysses", "zh": "尤利西斯" },
          "author": { "name_original": "James Joyce", "name_latinized": "Joyce", "name_chinese": "詹姆斯·乔伊斯", "lifespan": "1882-1941年", "civilization": "20th century Ireland" },
          "metadata": { "period": "现代多元期", "estimated_date": "1922年", "original_language": "英语", "genre": ["小说", "现代主义", "意识流"], "length_category": "长", "difficulty_level": 9, "babel_rating": 9.5 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "爱尔兰/现代主义", "historical_context": "爱尔兰独立运动，现代主义高潮", "contemporary_works": ["荒原", "追忆似水年华"], "predecessors": ["荷马史诗", "现实主义小说", "象征主义"], "successors": ["后现代小说", "实验文学"] },
          "thematic_tags": [{ "tag": "现代主义", "weight": 0.9 }, { "tag": "意识流", "weight": 0.9 }, { "tag": "神话", "weight": 0.8 }, { "tag": "日常生活", "weight": 0.8 }, { "tag": "语言实验", "weight": 0.9 }, { "tag": "都市", "weight": 0.7 }]
        },
        {
          "id": "078",
          "title_original": "The Waste Land",
          "title_translations": { "en": "The Waste Land", "zh": "荒原" },
          "author": { "name_original": "T. S. Eliot", "name_latinized": "Eliot", "name_chinese": "T·S·艾略特", "lifespan": "1888-1965年", "civilization": "20th century Britain/America" },
          "metadata": { "period": "现代多元期", "estimated_date": "1922年", "original_language": "英语", "genre": ["诗歌", "现代主义", "碎片化"], "length_category": "短", "difficulty_level": 8, "babel_rating": 9.3 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "现代主义", "historical_context": "第一次世界大战后，迷惘的一代", "contemporary_works": ["尤利西斯", "追忆似水年华"], "predecessors": ["但丁", "法国象征主义", "玄学派诗歌"], "successors": ["现代诗歌", "文学批评"] },
          "thematic_tags": [{ "tag": "现代主义诗歌", "weight": 0.9 }, { "tag": "碎片化", "weight": 0.9 }, { "tag": "精神危机", "weight": 0.9 }, { "tag": "神话", "weight": 0.8 }, { "tag": "典故", "weight": 0.9 }, { "tag": "现代性", "weight": 0.9 }]
        },
        {
          "id": "079",
          "title_original": "Sein und Zeit",
          "title_translations": { "en": "Being and Time", "zh": "存在与时间" },
          "author": { "name_original": "Martin Heidegger", "name_latinized": "Heidegger", "name_chinese": "马丁·海德格尔", "lifespan": "1889-1976年", "civilization": "20th century Germany" },
          "metadata": { "period": "现代多元期", "estimated_date": "1927年", "original_language": "德语", "genre": ["哲学", "现象学", "存在论"], "length_category": "长", "difficulty_level": 9, "babel_rating": 9.5 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "欧陆哲学", "historical_context": "魏玛德国，两次世界大战间", "contemporary_works": ["维特根斯坦逻辑哲学论", "胡塞尔现象学"], "predecessors": ["亚里士多德", "康德", "胡塞尔", "克尔凯郭尔"], "successors": ["存在主义", "解释学", "后结构主义"] },
          "thematic_tags": [{ "tag": "存在", "weight": 0.9 }, { "tag": "此在", "weight": 0.9 }, { "tag": "时间性", "weight": 0.8 }, { "tag": "本真性", "weight": 0.7 }, { "tag": "现象学", "weight": 0.8 }, { "tag": "存在主义", "weight": 0.8 }]
        },
        {
          "id": "080",
          "title_original": "Tractatus Logico-Philosophicus",
          "title_translations": { "en": "Tractatus Logico-Philosophicus", "zh": "逻辑哲学论" },
          "author": { "name_original": "Ludwig Wittgenstein", "name_latinized": "Wittgenstein", "name_chinese": "路德维希·维特根斯坦", "lifespan": "1889-1951年", "civilization": "20th century Austria/Britain" },
          "metadata": { "period": "现代多元期", "estimated_date": "1921年", "original_language": "德语", "genre": ["哲学", "逻辑", "语言"], "length_category": "短", "difficulty_level": 9, "babel_rating": 9.4 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "分析哲学", "historical_context": "第一次世界大战后，逻辑实证主义兴起", "contemporary_works": ["罗素著作", "维也纳学派"], "predecessors": ["弗雷格", "罗素", "逻辑学"], "successors": ["分析哲学", "语言哲学", "后期维特根斯坦"] },
          "thematic_tags": [{ "tag": "逻辑", "weight": 0.9 }, { "tag": "语言", "weight": 0.9 }, { "tag": "命题", "weight": 0.8 }, { "tag": "图像论", "weight": 0.8 }, { "tag": "语言界限", "weight": 0.9 }, { "tag": "分析哲学", "weight": 0.9 }]
        },
        {
          "id": "081",
          "title_original": "À la recherche du temps perdu",
          "title_translations": { "en": "In Search of Lost Time", "zh": "追忆似水年华" },
          "author": { "name_original": "Marcel Proust", "name_latinized": "Proust", "name_chinese": "马塞尔·普鲁斯特", "lifespan": "1871-1922年", "civilization": "20th century France" },
          "metadata": { "period": "现代多元期", "estimated_date": "1913-1927年", "original_language": "法语", "genre": ["小说", "现代主义", "记忆"], "length_category": "极长", "difficulty_level": 8, "babel_rating": 9.6 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "法国现代主义", "historical_context": "美好时代至第一次世界大战后", "contemporary_works": ["法国现代主义", "柏格森哲学"], "predecessors": ["法国现实主义", "象征主义", "心理小说"], "successors": ["现代小说", "记忆文学", "意识流"] },
          "thematic_tags": [{ "tag": "记忆", "weight": 0.9 }, { "tag": "时间", "weight": 0.9 }, { "tag": "意识", "weight": 0.8 }, { "tag": "社会", "weight": 0.8 }, { "tag": "艺术", "weight": 0.7 }, { "tag": "现代主义小说", "weight": 0.9 }]
        },
        {
          "id": "082",
          "title_original": "The Sound and the Fury",
          "title_translations": { "en": "The Sound and the Fury", "zh": "喧哗与骚动" },
          "author": { "name_original": "William Faulkner", "name_latinized": "Faulkner", "name_chinese": "威廉·福克纳", "lifespan": "1897-1962年", "civilization": "20th century America" },
          "metadata": { "period": "现代多元期", "estimated_date": "1929年", "original_language": "英语", "genre": ["小说", "现代主义", "南方文学"], "length_category": "中等", "difficulty_level": 8, "babel_rating": 9.2 },
          "civilization_context": { "region": "北美", "cultural_sphere": "美国南方", "historical_context": "美国南方，大萧条前", "contemporary_works": ["海明威著作", "菲茨杰拉德著作"], "predecessors": ["乔伊斯", "康拉德", "美国地方色彩"], "successors": ["南方文学", "美国现代主义", "实验叙事"] },
          "thematic_tags": [{ "tag": "现代主义小说", "weight": 0.9 }, { "tag": "南方", "weight": 0.8 }, { "tag": "家族衰落", "weight": 0.8 }, { "tag": "意识流", "weight": 0.8 }, { "tag": "时间", "weight": 0.7 }, { "tag": "叙事实验", "weight": 0.8 }]
        },
        {
          "id": "083",
          "title_original": "Le Deuxième Sexe",
          "title_translations": { "en": "The Second Sex", "zh": "第二性" },
          "author": { "name_original": "Simone de Beauvoir", "name_latinized": "Beauvoir", "name_chinese": "西蒙娜·德·波伏娃", "lifespan": "1908-1986年", "civilization": "20th century France" },
          "metadata": { "period": "现代多元期", "estimated_date": "1949年", "original_language": "法语", "genre": ["女权主义", "哲学", "社会学"], "length_category": "长", "difficulty_level": 8, "babel_rating": 9.4 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "法国存在主义", "historical_context": "第二次世界大战后，存在主义流行", "contemporary_works": ["萨特著作", "梅洛-庞蒂著作"], "predecessors": ["存在主义", "早期女权主义", "现象学"], "successors": ["第二波女权主义", "性别研究", "女性主义哲学"] },
          "thematic_tags": [{ "tag": "女权主义", "weight": 0.9 }, { "tag": "存在主义", "weight": 0.8 }, { "tag": "性别", "weight": 0.9 }, { "tag": "他者", "weight": 0.9 }, { "tag": "自由", "weight": 0.8 }, { "tag": "社会建构", "weight": 0.8 }]
        },
        {
          "id": "084",
          "title_original": "Nineteen Eighty-Four",
          "title_translations": { "en": "Nineteen Eighty-Four", "zh": "一九八四" },
          "author": { "name_original": "George Orwell", "name_latinized": "Orwell", "name_chinese": "乔治·奥威尔", "lifespan": "1903-1950年", "civilization": "20th century Britain" },
          "metadata": { "period": "现代多元期", "estimated_date": "1949年", "original_language": "英语", "genre": ["小说", "反乌托邦", "政治"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 9.5 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "英国", "historical_context": "冷战开始，极权主义反思", "contemporary_works": ["动物农场", "赫胥黎美丽新世界"], "predecessors": ["俄国革命文学", "反乌托邦传统", "政治讽刺"], "successors": ["冷战文学", "反乌托邦想象", "政治小说"] },
          "thematic_tags": [{ "tag": "反乌托邦", "weight": 0.9 }, { "tag": "极权主义", "weight": 0.9 }, { "tag": "语言控制", "weight": 0.8 }, { "tag": "监控", "weight": 0.8 }, { "tag": "真理", "weight": 0.8 }, { "tag": "政治讽刺", "weight": 0.8 }]
        },
        {
          "id": "085",
          "title_original": "Cien años de soledad",
          "title_translations": { "en": "One Hundred Years of Solitude", "zh": "百年孤独" },
          "author": { "name_original": "Gabriel García Márquez", "name_latinized": "García Márquez", "name_chinese": "加夫列尔·加西亚·马尔克斯", "lifespan": "1927-2014年", "civilization": "20th century Colombia" },
          "metadata": { "period": "现代多元期", "estimated_date": "1967年", "original_language": "西班牙语", "genre": ["小说", "魔幻现实主义", "家族史诗"], "length_category": "长", "difficulty_level": 6, "babel_rating": 9.2 },
          "civilization_context": { "region": "拉丁美洲", "cultural_sphere": "拉丁美洲文学爆炸", "historical_context": "拉丁美洲文学爆炸，冷战时期", "contemporary_works": ["跳房子", "富恩特斯著作"], "predecessors": ["福克纳", "卡夫卡", "拉丁美洲地方主义"], "successors": ["全球魔幻现实主义", "后殖民文学"] },
          "thematic_tags": [{ "tag": "魔幻现实主义", "weight": 0.9 }, { "tag": "家族史诗", "weight": 0.8 }, { "tag": "孤独", "weight": 0.9 }, { "tag": "历史", "weight": 0.7 }, { "tag": "记忆", "weight": 0.7 }, { "tag": "拉美", "weight": 0.8 }]
        },
        {
          "id": "086",
          "title_original": "管锥编",
          "title_translations": { "en": "Limited Views", "zh": "管锥编" },
          "author": { "name_original": "钱钟书", "name_latinized": "Qian Zhongshu", "name_chinese": "钱钟书", "lifespan": "1910-1998年", "civilization": "20th century China" },
          "metadata": { "period": "现代多元期", "estimated_date": "1979年", "original_language": "文言文", "genre": ["学术", "比较文学", "笔记"], "length_category": "极长", "difficulty_level": 9, "babel_rating": 8.8 },
          "civilization_context": { "region": "东亚", "cultural_sphere": "中国", "historical_context": "文化大革命后，中国学术复兴", "contemporary_works": ["围城", "中国现代学术"], "predecessors": ["中国笔记传统", "西方文学理论", "训诂学"], "successors": ["中西比较文学", "中国现代学术"] },
          "thematic_tags": [{ "tag": "比较文学", "weight": 0.9 }, { "tag": "学术", "weight": 0.9 }, { "tag": "笔记", "weight": 0.8 }, { "tag": "东西方", "weight": 0.9 }, { "tag": "互文性", "weight": 0.8 }, { "tag": "中国传统", "weight": 0.8 }]
        },
        {
          "id": "087",
          "title_original": "Silent Spring",
          "title_translations": { "en": "Silent Spring", "zh": "寂静的春天" },
          "author": { "name_original": "Rachel Carson", "name_latinized": "Carson", "name_chinese": "蕾切尔·卡森", "lifespan": "1907-1964年", "civilization": "20th century America" },
          "metadata": { "period": "现代多元期", "estimated_date": "1962年", "original_language": "英语", "genre": ["环保", "科学", "社会行动"], "length_category": "中等", "difficulty_level": 6, "babel_rating": 9.1 },
          "civilization_context": { "region": "北美", "cultural_sphere": "美国环保运动", "historical_context": "战后化学工业扩张，环保意识萌芽", "contemporary_works": ["增长的极限", "生态学发展"], "predecessors": ["梭罗", "缪尔", "生态学"], "successors": ["现代环保运动", "环境科学", "生态文学"] },
          "thematic_tags": [{ "tag": "环保", "weight": 0.9 }, { "tag": "生态", "weight": 0.9 }, { "tag": "杀虫剂", "weight": 0.8 }, { "tag": "科学写作", "weight": 0.8 }, { "tag": "行动主义", "weight": 0.8 }, { "tag": "自然", "weight": 0.8 }]
        },
        {
          "id": "088",
          "title_original": "A Theory of Justice",
          "title_translations": { "en": "A Theory of Justice", "zh": "正义论" },
          "author": { "name_original": "John Rawls", "name_latinized": "Rawls", "name_chinese": "约翰·罗尔斯", "lifespan": "1921-2002年", "civilization": "20th century America" },
          "metadata": { "period": "现代多元期", "estimated_date": "1971年", "original_language": "英语", "genre": ["政治哲学", "伦理", "理论"], "length_category": "长", "difficulty_level": 8, "babel_rating": 9.4 },
          "civilization_context": { "region": "北美", "cultural_sphere": "美国学术", "historical_context": "美国民权运动后，政治哲学复兴", "contemporary_works": ["诺齐克著作", "罗蒂著作"], "predecessors": ["康德", "社会契约传统", "功利主义"], "successors": ["当代政治哲学", "自由主义辩论", "分配正义理论"] },
          "thematic_tags": [{ "tag": "正义", "weight": 0.9 }, { "tag": "政治哲学", "weight": 0.9 }, { "tag": "无知之幕", "weight": 0.9 }, { "tag": "公平", "weight": 0.8 }, { "tag": "自由主义", "weight": 0.8 }, { "tag": "社会契约", "weight": 0.8 }]
        },
        {
          "id": "089",
          "title_original": "Orientalism",
          "title_translations": { "en": "Orientalism", "zh": "东方学" },
          "author": { "name_original": "Edward Said", "name_latinized": "Said", "name_chinese": "爱德华·萨义德", "lifespan": "1935-2003年", "civilization": "Palestinian-American" },
          "metadata": { "period": "现代多元期", "estimated_date": "1978年", "original_language": "英语", "genre": ["文化批评", "后殖民", "理论"], "length_category": "中等", "difficulty_level": 8, "babel_rating": 9.3 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "后殖民", "historical_context": "后殖民时代，文化研究兴起", "contemporary_works": ["法农著作", "后结构主义"], "predecessors": ["福柯", "葛兰西", "反殖民思想"], "successors": ["后殖民研究", "文化研究", "东方主义批判"] },
          "thematic_tags": [{ "tag": "东方主义", "weight": 0.9 }, { "tag": "后殖民", "weight": 0.9 }, { "tag": "文化批评", "weight": 0.8 }, { "tag": "权力/知识", "weight": 0.8 }, { "tag": "表征", "weight": 0.8 }, { "tag": "东西方", "weight": 0.9 }]
        },
        {
          "id": "090",
          "title_original": "The Clash of Civilizations and the Remaking of World Order",
          "title_translations": { "en": "The Clash of Civilizations", "zh": "文明的冲突" },
          "author": { "name_original": "Samuel P. Huntington", "name_latinized": "Huntington", "name_chinese": "塞缪尔·P·亨廷顿", "lifespan": "1927-2008年", "civilization": "20th century America" },
          "metadata": { "period": "现代多元期", "estimated_date": "1996年", "original_language": "英语", "genre": ["政治学", "国际关系", "理论"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 8.9 },
          "civilization_context": { "region": "北美", "cultural_sphere": "国际关系", "historical_context": "冷战结束后，全球化加速", "contemporary_works": ["福山历史终结", "全球化讨论"], "predecessors": ["斯宾格勒", "汤因比", "现实主义国际关系"], "successors": ["文明对话", "文化冲突理论", "国际关系辩论"] },
          "thematic_tags": [{ "tag": "文明", "weight": 0.9 }, { "tag": "国际关系", "weight": 0.9 }, { "tag": "文化冲突", "weight": 0.9 }, { "tag": "后冷战", "weight": 0.8 }, { "tag": "全球政治", "weight": 0.8 }, { "tag": "认同", "weight": 0.8 }]
        },
        {
          "id": "091",
          "title_original": "A Brief History of Time",
          "title_translations": { "en": "A Brief History of Time", "zh": "时间简史" },
          "author": { "name_original": "Stephen Hawking", "name_latinized": "Hawking", "name_chinese": "斯蒂芬·霍金", "lifespan": "1942-2018年", "civilization": "20th-21st century Britain" },
          "metadata": { "period": "现代多元期", "estimated_date": "1988年", "original_language": "英语", "genre": ["科普", "宇宙学", "物理学"], "length_category": "短", "difficulty_level": 6, "babel_rating": 9.0 },
          "civilization_context": { "region": "北美", "cultural_sphere": "科普", "historical_context": "晚期冷战，科学普及时代", "contemporary_works": ["混沌理论", "弦理论发展"], "predecessors": ["爱因斯坦", "量子力学", "宇宙学"], "successors": ["科学普及", "公众理解科学", "宇宙学普及"] },
          "thematic_tags": [{ "tag": "宇宙学", "weight": 0.9 }, { "tag": "科普", "weight": 0.9 }, { "tag": "时间", "weight": 0.9 }, { "tag": "宇宙", "weight": 0.9 }, { "tag": "黑洞", "weight": 0.8 }, { "tag": "大爆炸", "weight": 0.8 }]
        },
        {
          "id": "092",
          "title_original": "ノルウェイの森",
          "title_translations": { "en": "Norwegian Wood", "zh": "挪威的森林" },
          "author": { "name_original": "村上春树", "name_latinized": "Haruki Murakami", "name_chinese": "村上春树", "lifespan": "1949年至今", "civilization": "Contemporary Japan" },
          "metadata": { "period": "现代多元期", "estimated_date": "1987年", "original_language": "日语", "genre": ["小说", "成长", "爱情"], "length_category": "中等", "difficulty_level": 6, "babel_rating": 8.8 },
          "civilization_context": { "region": "东亚", "cultural_sphere": "当代日本", "historical_context": "日本泡沫经济时期，全球村上现象", "contemporary_works": ["其他村上作品", "日本现代文学"], "predecessors": ["菲茨杰拉德", "雷蒙德·钱德勒", "日本战后文学"], "successors": ["全球流行文学", "日本文学国际影响"] },
          "thematic_tags": [{ "tag": "成长", "weight": 0.8 }, { "tag": "爱情", "weight": 0.8 }, { "tag": "失去", "weight": 0.8 }, { "tag": "1960年代日本", "weight": 0.7 }, { "tag": "忧郁", "weight": 0.8 }, { "tag": "当代日本", "weight": 0.8 }]
        },
        {
          "id": "093",
          "title_original": "Beloved",
          "title_translations": { "en": "Beloved", "zh": "宠儿" },
          "author": { "name_original": "Toni Morrison", "name_latinized": "Morrison", "name_chinese": "托妮·莫里森", "lifespan": "1931-2019年", "civilization": "Contemporary America" },
          "metadata": { "period": "现代多元期", "estimated_date": "1987年", "original_language": "英语", "genre": ["小说", "历史小说", "非裔美国"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 9.2 },
          "civilization_context": { "region": "北美", "cultural_sphere": "非裔美国", "historical_context": "美国民权运动后，非裔文学繁荣", "contemporary_works": ["艾丽斯·沃克著作", "非裔美国文学"], "predecessors": ["福克纳", "南方文学", "奴隶叙事"], "successors": ["非裔女性文学", "创伤叙事", "美国文学多元"] },
          "thematic_tags": [{ "tag": "奴隶制", "weight": 0.9 }, { "tag": "记忆", "weight": 0.8 }, { "tag": "创伤", "weight": 0.8 }, { "tag": "母性", "weight": 0.8 }, { "tag": "非裔美国", "weight": 0.9 }, { "tag": "历史小说", "weight": 0.8 }]
        },
        {
          "id": "094",
          "title_original": "Архипелаг ГУЛАГ",
          "title_translations": { "en": "The Gulag Archipelago", "zh": "古拉格群岛" },
          "author": { "name_original": "Александр Исаевич Солженицын", "name_latinized": "Aleksandr Solzhenitsyn", "name_chinese": "亚历山大·索尔仁尼琴", "lifespan": "1918-2008年", "civilization": "20th century Russia" },
          "metadata": { "period": "现代多元期", "estimated_date": "1973年", "original_language": "俄语", "genre": ["历史", "回忆录", "政治"], "length_category": "极长", "difficulty_level": 8, "babel_rating": 9.3 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "俄罗斯异议", "historical_context": "冷战高峰期，苏联持不同政见运动", "contemporary_works": ["癌病房", "伊万·杰尼索维奇的一天"], "predecessors": ["陀思妥耶夫斯基", "俄罗斯文学", "集中营文学"], "successors": ["苏联历史重估", "人权文学", "极权主义批判"] },
          "thematic_tags": [{ "tag": "古拉格", "weight": 0.9 }, { "tag": "极权主义", "weight": 0.9 }, { "tag": "记忆", "weight": 0.8 }, { "tag": "苦难", "weight": 0.8 }, { "tag": "异议", "weight": 0.8 }, { "tag": "历史见证", "weight": 0.9 }]
        },
        {
          "id": "095",
          "title_original": "Invisible Man",
          "title_translations": { "en": "Invisible Man", "zh": "看不见的人" },
          "author": { "name_original": "Ralph Ellison", "name_latinized": "Ellison", "name_chinese": "拉尔夫·埃里森", "lifespan": "1914-1994年", "civilization": "20th century America" },
          "metadata": { "period": "现代多元期", "estimated_date": "1952年", "original_language": "英语", "genre": ["小说", "非裔美国", "身份"], "length_category": "长", "difficulty_level": 8, "babel_rating": 9.1 },
          "civilization_context": { "region": "北美", "cultural_sphere": "非裔美国", "historical_context": "美国民权运动前夕，种族隔离", "contemporary_works": ["理查德·赖特著作", "詹姆斯·鲍德温著作"], "predecessors": ["陀思妥耶夫斯基", "现代主义", "非裔美国文化"], "successors": ["非裔美国文学经典", "身份政治文学"] },
          "thematic_tags": [{ "tag": "不可见性", "weight": 0.9 }, { "tag": "身份", "weight": 0.9 }, { "tag": "种族", "weight": 0.9 }, { "tag": "美国梦", "weight": 0.7 }, { "tag": "现代主义", "weight": 0.8 }, { "tag": "非裔美国", "weight": 0.9 }]
        },
        {
          "id": "096",
          "title_original": "Le città invisibili",
          "title_translations": { "en": "Invisible Cities", "zh": "看不见的城市" },
          "author": { "name_original": "Italo Calvino", "name_latinized": "Calvino", "name_chinese": "伊塔洛·卡尔维诺", "lifespan": "1923-1985年", "civilization": "20th century Italy" },
          "metadata": { "period": "现代多元期", "estimated_date": "1972年", "original_language": "意大利语", "genre": ["小说", "后现代", "幻想"], "length_category": "短", "difficulty_level": 7, "babel_rating": 9.0 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "意大利后现代", "historical_context": "后现代文学兴起，欧洲实验写作", "contemporary_works": ["如果在冬夜，一个旅人", "意大利文学"], "predecessors": ["博尔赫斯", "卡尔维诺早期作品", "寓言传统"], "successors": ["后现代小说", "实验叙事", "城市文学"] },
          "thematic_tags": [{ "tag": "城市", "weight": 0.9 }, { "tag": "想象", "weight": 0.8 }, { "tag": "旅行", "weight": 0.7 }, { "tag": "记忆", "weight": 0.7 }, { "tag": "后现代", "weight": 0.8 }, { "tag": "意大利文学", "weight": 0.7 }]
        },
        {
          "id": "097",
          "title_original": "Histoire de la folie à l'âge classique",
          "title_translations": { "en": "Madness and Civilization", "zh": "疯癫与文明" },
          "author": { "name_original": "Michel Foucault", "name_latinized": "Foucault", "name_chinese": "米歇尔·福柯", "lifespan": "1926-1984年", "civilization": "20th century France" },
          "metadata": { "period": "现代多元期", "estimated_date": "1961年", "original_language": "法语", "genre": ["哲学", "历史", "批判"], "length_category": "长", "difficulty_level": 8, "babel_rating": 9.4 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "法国理论", "historical_context": "后结构主义兴起，1960年代思想革命", "contemporary_works": ["德里达著作", "拉康著作"], "predecessors": ["尼采", "海德格尔", "法国认识论"], "successors": ["后现代理论", "文化研究", "批判理论"] },
          "thematic_tags": [{ "tag": "疯癫", "weight": 0.9 }, { "tag": "权力", "weight": 0.9 }, { "tag": "知识", "weight": 0.8 }, { "tag": "制度", "weight": 0.8 }, { "tag": "历史", "weight": 0.8 }, { "tag": "后结构主义", "weight": 0.9 }]
        },
        {
          "id": "098",
          "title_original": "Things Fall Apart",
          "title_translations": { "en": "Things Fall Apart", "zh": "瓦解" },
          "author": { "name_original": "Chinua Achebe", "name_latinized": "Achebe", "name_chinese": "钦努阿·阿契贝", "lifespan": "1930-2013年", "civilization": "20th century Nigeria" },
          "metadata": { "period": "现代多元期", "estimated_date": "1958年", "original_language": "英语", "genre": ["小说", "后殖民", "非洲"], "length_category": "短", "difficulty_level": 6, "babel_rating": 9.1 },
          "civilization_context": { "region": "非洲", "cultural_sphere": "非洲文学", "historical_context": "非洲去殖民化，尼日利亚独立前", "contemporary_works": ["其他非洲英语文学", "非洲独立运动"], "predecessors": ["欧洲小说", "非洲口头传统", "殖民文学"], "successors": ["非洲文学传统", "后殖民小说", "全球英语文学"] },
          "thematic_tags": [{ "tag": "后殖民", "weight": 0.9 }, { "tag": "非洲", "weight": 0.9 }, { "tag": "文化冲突", "weight": 0.9 }, { "tag": "传统与变迁", "weight": 0.8 }, { "tag": "殖民主义", "weight": 0.9 }, { "tag": "伊博文化", "weight": 0.8 }]
        },
        {
          "id": "099",
          "title_original": "Gravity's Rainbow",
          "title_translations": { "en": "Gravity's Rainbow", "zh": "万有引力之虹" },
          "author": { "name_original": "Thomas Pynchon", "name_latinized": "Pynchon", "name_chinese": "托马斯·品钦", "lifespan": "1937年至今", "civilization": "Contemporary America" },
          "metadata": { "period": "现代多元期", "estimated_date": "1973年", "original_language": "英语", "genre": ["小说", "后现代", "百科全书式"], "length_category": "极长", "difficulty_level": 9, "babel_rating": 9.3 },
          "civilization_context": { "region": "北美", "cultural_sphere": "美国后现代", "historical_context": "越战时期，后现代小说高峰", "contemporary_works": ["美国后现代文学", "系统理论"], "predecessors": ["乔伊斯", "纳博科夫", "美国实验小说"], "successors": ["后现代文学经典", "信息时代小说"] },
          "thematic_tags": [{ "tag": "后现代", "weight": 0.9 }, { "tag": "百科全书式", "weight": 0.9 }, { "tag": "偏执", "weight": 0.8 }, { "tag": "技术", "weight": 0.8 }, { "tag": "战争", "weight": 0.8 }, { "tag": "系统", "weight": 0.8 }]
        },
        {
          "id": "100",
          "title_original": "Nesnesitelná lehkost bytí",
          "title_translations": { "en": "The Unbearable Lightness of Being", "zh": "生命中不能承受之轻" },
          "author": { "name_original": "Milan Kundera", "name_latinized": "Kundera", "name_chinese": "米兰·昆德拉", "lifespan": "1929年至今", "civilization": "Czech/French" },
          "metadata": { "period": "现代多元期", "estimated_date": "1984年", "original_language": "捷克语", "genre": ["小说", "哲学", "政治"], "length_category": "中等", "difficulty_level": 7, "babel_rating": 9.0 },
          "civilization_context": { "region": "欧洲", "cultural_sphere": "中欧", "historical_context": "布拉格之春后，东欧流亡文学", "contemporary_works": ["其他昆德拉作品", "东欧文学"], "predecessors": ["卡夫卡", "尼采", "法国小说"], "successors": ["流亡文学", "政治哲学小说", "欧洲小说传统"] },
          "thematic_tags": [{ "tag": "轻", "weight": 0.9 }, { "tag": "爱情", "weight": 0.8 }, { "tag": "政治", "weight": 0.8 }, { "tag": "流亡", "weight": 0.7 }, { "tag": "存在主义", "weight": 0.8 }, { "tag": "捷克", "weight": 0.7 }]
        },
        {
          "id": "101",
          "title_original": "קיצור תולדות האנושות",
          "title_translations": { "en": "Sapiens: A Brief History of Humankind", "zh": "人类简史" },
          "author": { "name_original": "יובל נח הררי", "name_latinized": "Yuval Noah Harari", "name_chinese": "尤瓦尔·赫拉利", "lifespan": "1976年至今", "civilization": "Contemporary Israel/Global" },
          "metadata": { "period": "现代多元期", "estimated_date": "2011年（希伯来语），2014年（英语）", "original_language": "希伯来语", "genre": ["历史", "大历史", "科普"], "length_category": "中等", "difficulty_level": 5, "babel_rating": 8.9 },
          "civilization_context": { "region": "中东", "cultural_sphere": "全球知识界", "historical_context": "21世纪初，全球化，数字时代", "contemporary_works": ["皮凯蒂21世纪资本论", "其他大历史著作"], "predecessors": ["戴蒙德", "大历史项目", "世界历史综合"], "successors": ["未来简史", "21世纪大历史", "公众历史理解"] },
          "thematic_tags": [{ "tag": "大历史", "weight": 0.9 }, { "tag": "人类历史", "weight": 0.9 }, { "tag": "认知革命", "weight": 0.8 }, { "tag": "想象的现实", "weight": 0.9 }, { "tag": "科普", "weight": 0.8 }, { "tag": "未来推测", "weight": 0.6 }]
        }
      ]
    }
  }
};


// Default fallback for the reader
export const DEFAULT_BOOK: ReaderBook = {
  id: "DDJ-001",
  title: "Dao De Jing",
  author: "Laozi",
  language: "Classical Chinese",
  publisher: "Ancient Philosophy Press",
  publication_year: "~400 BCE",
  version: "Wang Bi Commentary Version",
  chapters: [
    {
      "chapter_number": 1,
      "chapter_title": "Chapter 1",
      "original_text": "道可道，非常道；名可名，非常名。无名天地之始，有名万物之母。故常无欲以观其妙；常有欲以观其徼。此两者同出而异名，同谓之玄，玄之又玄，众妙之门。",
      "translations": [
        { "translator": "Arthur Waley", "text": "The Way that can be told of is not an Unvarying Way...", "language": "English" }
      ],
      "book_annotations": [],
      "user_notes_template": { "cues": [], "notes": "", "summary": "" }
    }
  ],
  metadata: { "total_chapters": 81, "annotation_count": 247, "last_updated": "2023-10-15", "license": "Public Domain" }
};
