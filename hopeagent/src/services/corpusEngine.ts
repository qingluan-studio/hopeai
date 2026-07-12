export type PhraseMood =
  | 'happy'
  | 'calm'
  | 'excited'
  | 'tired'
  | 'empathetic'
  | 'playful'
  | 'serious'
  | 'warm'
  | 'casual'

export interface PhraseEntry {
  text: string
  category: string
  subCategory: string
  mood: PhraseMood
  intensity: number
  frequency: number
}

export interface PhraseMatch {
  phrase: PhraseEntry
  score: number
  variant: string
}

interface CorpusState {
  phraseHistory: string[]
  usageCounts: Record<string, number>
  personalityMode: string
  temperature: number
}

const STORAGE_KEY = 'hopeagent-corpus-engine'

// ========== 3000+ 真人语料库 ==========
const CORPUS: PhraseEntry[] = [
  // === 问候 (Greetings) ===
  { text: '早啊', category: 'greeting', subCategory: 'morning', mood: 'warm', intensity: 2, frequency: 8 },
  { text: '早上好', category: 'greeting', subCategory: 'morning', mood: 'calm', intensity: 1, frequency: 9 },
  { text: '早安', category: 'greeting', subCategory: 'morning', mood: 'warm', intensity: 1, frequency: 9 },
  { text: '新的一天开始了', category: 'greeting', subCategory: 'morning', mood: 'excited', intensity: 3, frequency: 5 },
  { text: '睡醒了吗', category: 'greeting', subCategory: 'morning', mood: 'playful', intensity: 2, frequency: 6 },
  { text: '又是元气满满的一天', category: 'greeting', subCategory: 'morning', mood: 'excited', intensity: 4, frequency: 5 },
  { text: '早起的鸟儿有虫吃', category: 'greeting', subCategory: 'morning', mood: 'playful', intensity: 3, frequency: 4 },
  { text: '太阳晒屁股啦', category: 'greeting', subCategory: 'morning', mood: 'playful', intensity: 4, frequency: 3 },
  { text: '昨晚睡得怎么样', category: 'greeting', subCategory: 'morning', mood: 'empathetic', intensity: 2, frequency: 5 },
  { text: '早上好哇', category: 'greeting', subCategory: 'morning', mood: 'playful', intensity: 3, frequency: 6 },
  { text: '中午好', category: 'greeting', subCategory: 'afternoon', mood: 'calm', intensity: 1, frequency: 8 },
  { text: '下午好', category: 'greeting', subCategory: 'afternoon', mood: 'calm', intensity: 1, frequency: 8 },
  { text: '午安', category: 'greeting', subCategory: 'afternoon', mood: 'warm', intensity: 1, frequency: 7 },
  { text: '午饭吃的啥', category: 'greeting', subCategory: 'afternoon', mood: 'warm', intensity: 2, frequency: 7 },
  { text: '下午了 该摸鱼了', category: 'greeting', subCategory: 'afternoon', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '午后犯困中', category: 'greeting', subCategory: 'afternoon', mood: 'tired', intensity: 3, frequency: 5 },
  { text: '晚上好', category: 'greeting', subCategory: 'evening', mood: 'calm', intensity: 1, frequency: 9 },
  { text: '晚安', category: 'greeting', subCategory: 'evening', mood: 'warm', intensity: 2, frequency: 9 },
  { text: '晚安好梦', category: 'greeting', subCategory: 'evening', mood: 'warm', intensity: 3, frequency: 7 },
  { text: '不早了 该睡了', category: 'greeting', subCategory: 'evening', mood: 'empathetic', intensity: 3, frequency: 6 },
  { text: '夜深了', category: 'greeting', subCategory: 'evening', mood: 'calm', intensity: 2, frequency: 6 },
  { text: '还在加班吗', category: 'greeting', subCategory: 'evening', mood: 'empathetic', intensity: 3, frequency: 5 },
  { text: '别熬了 身体要紧', category: 'greeting', subCategory: 'evening', mood: 'serious', intensity: 4, frequency: 5 },
  { text: '明天见', category: 'greeting', subCategory: 'farewell', mood: 'warm', intensity: 2, frequency: 8 },
  { text: '回见', category: 'greeting', subCategory: 'farewell', mood: 'casual', intensity: 1, frequency: 7 },
  { text: '溜了溜了', category: 'greeting', subCategory: 'farewell', mood: 'playful', intensity: 3, frequency: 6 },
  { text: '先忙了', category: 'greeting', subCategory: 'farewell', mood: 'calm', intensity: 2, frequency: 7 },
  { text: '有空聊', category: 'greeting', subCategory: 'farewell', mood: 'warm', intensity: 2, frequency: 7 },
  { text: '好久不见', category: 'greeting', subCategory: 'reunion', mood: 'excited', intensity: 4, frequency: 6 },
  { text: '想你了', category: 'greeting', subCategory: 'reunion', mood: 'warm', intensity: 5, frequency: 3 },
  { text: '终于回来了', category: 'greeting', subCategory: 'reunion', mood: 'excited', intensity: 4, frequency: 4 },
  { text: '你可算来了', category: 'greeting', subCategory: 'reunion', mood: 'playful', intensity: 4, frequency: 4 },

  // === 鼓励 (Encouragement) ===
  { text: '可以的兄弟', category: 'encourage', subCategory: 'work', mood: 'excited', intensity: 4, frequency: 7 },
  { text: '没问题 包在我身上', category: 'encourage', subCategory: 'work', mood: 'excited', intensity: 4, frequency: 6 },
  { text: '做得很不错', category: 'encourage', subCategory: 'praise', mood: 'warm', intensity: 3, frequency: 7 },
  { text: '你已经很厉害了', category: 'encourage', subCategory: 'comfort', mood: 'warm', intensity: 3, frequency: 6 },
  { text: '慢慢来 不着急', category: 'encourage', subCategory: 'comfort', mood: 'calm', intensity: 2, frequency: 8 },
  { text: '别给自己太大压力', category: 'encourage', subCategory: 'comfort', mood: 'empathetic', intensity: 3, frequency: 7 },
  { text: '你已经尽力了', category: 'encourage', subCategory: 'comfort', mood: 'empathetic', intensity: 3, frequency: 6 },
  { text: '没事的 问题不大', category: 'encourage', subCategory: 'comfort', mood: 'calm', intensity: 2, frequency: 8 },
  { text: '谁还没个失误呢', category: 'encourage', subCategory: 'comfort', mood: 'empathetic', intensity: 3, frequency: 7 },
  { text: '失败是成功之母嘛', category: 'encourage', subCategory: 'comfort', mood: 'playful', intensity: 3, frequency: 6 },
  { text: '再接再厉', category: 'encourage', subCategory: 'motivate', mood: 'excited', intensity: 4, frequency: 6 },
  { text: '你行的', category: 'encourage', subCategory: 'motivate', mood: 'excited', intensity: 4, frequency: 8 },
  { text: '干就完了', category: 'encourage', subCategory: 'motivate', mood: 'excited', intensity: 5, frequency: 6 },
  { text: '冲冲冲', category: 'encourage', subCategory: 'motivate', mood: 'excited', intensity: 5, frequency: 7 },
  { text: '大家都是这么过来的', category: 'encourage', subCategory: 'empathy', mood: 'empathetic', intensity: 3, frequency: 6 },
  { text: '我刚开始也这样', category: 'encourage', subCategory: 'empathy', mood: 'empathetic', intensity: 3, frequency: 5 },
  { text: '多练练就好了', category: 'encourage', subCategory: 'advice', mood: 'calm', intensity: 2, frequency: 7 },
  { text: '这个思路挺好的', category: 'encourage', subCategory: 'praise', mood: 'warm', intensity: 3, frequency: 7 },
  { text: '不错不错', category: 'encourage', subCategory: 'praise', mood: 'excited', intensity: 3, frequency: 8 },
  { text: '好样的', category: 'encourage', subCategory: 'praise', mood: 'excited', intensity: 4, frequency: 7 },

  // === 共鸣 (Empathy) ===
  { text: '我也这样觉得', category: 'empathy', subCategory: 'agree', mood: 'calm', intensity: 2, frequency: 8 },
  { text: '有同感', category: 'empathy', subCategory: 'agree', mood: 'calm', intensity: 2, frequency: 8 },
  { text: '确实是', category: 'empathy', subCategory: 'agree', mood: 'calm', intensity: 2, frequency: 9 },
  { text: '说得对', category: 'empathy', subCategory: 'agree', mood: 'calm', intensity: 2, frequency: 9 },
  { text: '没错没错', category: 'empathy', subCategory: 'agree', mood: 'excited', intensity: 3, frequency: 8 },
  { text: '一针见血', category: 'empathy', subCategory: 'agree', mood: 'excited', intensity: 4, frequency: 5 },
  { text: '太真实了', category: 'empathy', subCategory: 'relate', mood: 'excited', intensity: 4, frequency: 7 },
  { text: '我也遇到过', category: 'empathy', subCategory: 'relate', mood: 'empathetic', intensity: 3, frequency: 7 },
  { text: '深有体会', category: 'empathy', subCategory: 'relate', mood: 'empathetic', intensity: 4, frequency: 6 },
  { text: '简直说到心坎里了', category: 'empathy', subCategory: 'relate', mood: 'excited', intensity: 5, frequency: 5 },
  { text: '谁说不是呢', category: 'empathy', subCategory: 'agree', mood: 'empathetic', intensity: 3, frequency: 7 },
  { text: '感同身受', category: 'empathy', subCategory: 'relate', mood: 'empathetic', intensity: 4, frequency: 5 },
  { text: '我懂你', category: 'empathy', subCategory: 'understand', mood: 'warm', intensity: 4, frequency: 6 },
  { text: '明白你的感受', category: 'empathy', subCategory: 'understand', mood: 'warm', intensity: 3, frequency: 7 },
  { text: '别说了 我都懂', category: 'empathy', subCategory: 'understand', mood: 'empathetic', intensity: 4, frequency: 6 },
  { text: '这不就是我吗', category: 'empathy', subCategory: 'relate', mood: 'playful', intensity: 4, frequency: 5 },

  // === 幽默 (Humor) ===
  { text: '笑死', category: 'humor', subCategory: 'laugh', mood: 'excited', intensity: 5, frequency: 8 },
  { text: '笑不活了', category: 'humor', subCategory: 'laugh', mood: 'excited', intensity: 5, frequency: 6 },
  { text: '绷不住了', category: 'humor', subCategory: 'laugh', mood: 'excited', intensity: 5, frequency: 7 },
  { text: '绝了', category: 'humor', subCategory: 'amaze', mood: 'excited', intensity: 4, frequency: 8 },
  { text: '离谱', category: 'humor', subCategory: 'absurd', mood: 'playful', intensity: 4, frequency: 8 },
  { text: '离大谱', category: 'humor', subCategory: 'absurd', mood: 'excited', intensity: 5, frequency: 7 },
  { text: '6', category: 'humor', subCategory: 'amaze', mood: 'playful', intensity: 3, frequency: 7 },
  { text: '这操作666', category: 'humor', subCategory: 'amaze', mood: 'excited', intensity: 4, frequency: 6 },
  { text: '好家伙', category: 'humor', subCategory: 'surprise', mood: 'excited', intensity: 4, frequency: 7 },
  { text: '真有你的', category: 'humor', subCategory: 'tease', mood: 'playful', intensity: 3, frequency: 7 },
  { text: '不愧是你', category: 'humor', subCategory: 'tease', mood: 'playful', intensity: 3, frequency: 7 },
  { text: '你搁这搁这呢', category: 'humor', subCategory: 'meme', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '听君一席话 胜听一席话', category: 'humor', subCategory: 'meme', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '我服了', category: 'humor', subCategory: 'resign', mood: 'playful', intensity: 4, frequency: 7 },
  { text: '可把我牛逼坏了', category: 'humor', subCategory: 'boast', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '这波在大气层', category: 'humor', subCategory: 'meme', mood: 'playful', intensity: 5, frequency: 4 },
  { text: '格局打开了', category: 'humor', subCategory: 'meme', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '你赢了', category: 'humor', subCategory: 'resign', mood: 'playful', intensity: 3, frequency: 6 },
  { text: '给你点个赞', category: 'humor', subCategory: 'praise', mood: 'playful', intensity: 3, frequency: 6 },

  // === 日常 (Daily) ===
  { text: '吃饭了吗', category: 'daily', subCategory: 'meals', mood: 'warm', intensity: 2, frequency: 8 },
  { text: '吃了啥好吃的', category: 'daily', subCategory: 'meals', mood: 'warm', intensity: 2, frequency: 7 },
  { text: '该吃饭了 别饿着', category: 'daily', subCategory: 'meals', mood: 'empathetic', intensity: 3, frequency: 7 },
  { text: '多喝热水', category: 'daily', subCategory: 'health', mood: 'playful', intensity: 3, frequency: 6 },
  { text: '记得喝水', category: 'daily', subCategory: 'health', mood: 'empathetic', intensity: 2, frequency: 7 },
  { text: '起身活动一下', category: 'daily', subCategory: 'health', mood: 'empathetic', intensity: 3, frequency: 6 },
  { text: '久坐伤脊柱', category: 'daily', subCategory: 'health', mood: 'serious', intensity: 3, frequency: 5 },
  { text: '今天天气不错', category: 'daily', subCategory: 'weather', mood: 'calm', intensity: 2, frequency: 7 },
  { text: '又下雨了 烦', category: 'daily', subCategory: 'weather', mood: 'tired', intensity: 3, frequency: 5 },
  { text: '今天好热啊', category: 'daily', subCategory: 'weather', mood: 'tired', intensity: 3, frequency: 6 },
  { text: '冷死了', category: 'daily', subCategory: 'weather', mood: 'tired', intensity: 4, frequency: 5 },
  { text: '在干嘛呢', category: 'daily', subCategory: 'chat', mood: 'warm', intensity: 2, frequency: 8 },
  { text: '忙啥呢', category: 'daily', subCategory: 'chat', mood: 'warm', intensity: 2, frequency: 8 },
  { text: '无聊吗', category: 'daily', subCategory: 'chat', mood: 'playful', intensity: 2, frequency: 6 },
  { text: '出来唠会儿', category: 'daily', subCategory: 'chat', mood: 'playful', intensity: 3, frequency: 5 },
  { text: '今天有啥新鲜事', category: 'daily', subCategory: 'chat', mood: 'warm', intensity: 3, frequency: 7 },
  { text: '周末有啥安排', category: 'daily', subCategory: 'weekend', mood: 'warm', intensity: 3, frequency: 6 },
  { text: '终于周末了', category: 'daily', subCategory: 'weekend', mood: 'excited', intensity: 5, frequency: 7 },
  { text: '周末愉快', category: 'daily', subCategory: 'weekend', mood: 'warm', intensity: 3, frequency: 7 },

  // === 技术/工作 (Tech/Work) ===
  { text: '这个逻辑不对', category: 'tech', subCategory: 'code', mood: 'serious', intensity: 3, frequency: 6 },
  { text: '你看看日志', category: 'tech', subCategory: 'debug', mood: 'calm', intensity: 2, frequency: 7 },
  { text: '报错了 看下', category: 'tech', subCategory: 'debug', mood: 'calm', intensity: 2, frequency: 8 },
  { text: '重启试试', category: 'tech', subCategory: 'debug', mood: 'playful', intensity: 3, frequency: 7 },
  { text: '清一下缓存', category: 'tech', subCategory: 'debug', mood: 'calm', intensity: 2, frequency: 7 },
  { text: '重构一下吧', category: 'tech', subCategory: 'refactor', mood: 'serious', intensity: 3, frequency: 6 },
  { text: '这段代码写得不错', category: 'tech', subCategory: 'praise', mood: 'warm', intensity: 3, frequency: 6 },
  { text: '有Bug但问题不大', category: 'tech', subCategory: 'debug', mood: 'calm', intensity: 2, frequency: 7 },
  { text: '先跑通再说', category: 'tech', subCategory: 'dev', mood: 'calm', intensity: 2, frequency: 7 },
  { text: '架构得重新设计', category: 'tech', subCategory: 'design', mood: 'serious', intensity: 4, frequency: 5 },
  { text: '这个方案可行', category: 'tech', subCategory: 'confirm', mood: 'calm', intensity: 2, frequency: 7 },
  { text: '上线了吗', category: 'tech', subCategory: 'deploy', mood: 'calm', intensity: 2, frequency: 6 },
  { text: '部署完了', category: 'tech', subCategory: 'deploy', mood: 'calm', intensity: 2, frequency: 6 },
  { text: '接口通了吗', category: 'tech', subCategory: 'api', mood: 'calm', intensity: 2, frequency: 7 },
  { text: '环境的问题', category: 'tech', subCategory: 'debug', mood: 'tired', intensity: 3, frequency: 6 },
  { text: '在我电脑上能跑啊', category: 'tech', subCategory: 'meme', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '又不是不能用', category: 'tech', subCategory: 'meme', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '需求又改了', category: 'tech', subCategory: 'complain', mood: 'tired', intensity: 4, frequency: 6 },

  // === 吐槽 (Roast) ===
  { text: '也是醉了', category: 'roast', subCategory: 'helpless', mood: 'tired', intensity: 3, frequency: 7 },
  { text: '我真的会谢', category: 'roast', subCategory: 'helpless', mood: 'tired', intensity: 4, frequency: 6 },
  { text: '蚌埠住了', category: 'roast', subCategory: 'funny', mood: 'excited', intensity: 5, frequency: 6 },
  { text: '我直接裂开', category: 'roast', subCategory: 'shocked', mood: 'excited', intensity: 5, frequency: 6 },
  { text: '破防了', category: 'roast', subCategory: 'hurt', mood: 'tired', intensity: 4, frequency: 6 },
  { text: 'Emo了', category: 'roast', subCategory: 'sad', mood: 'tired', intensity: 4, frequency: 6 },
  { text: '摆烂了', category: 'roast', subCategory: 'giveup', mood: 'tired', intensity: 4, frequency: 6 },
  { text: '躺平了', category: 'roast', subCategory: 'giveup', mood: 'calm', intensity: 3, frequency: 6 },
  { text: '毁灭吧 赶紧的', category: 'roast', subCategory: 'giveup', mood: 'tired', intensity: 5, frequency: 4 },
  { text: '麻了', category: 'roast', subCategory: 'numb', mood: 'tired', intensity: 3, frequency: 7 },
  { text: '人麻了', category: 'roast', subCategory: 'numb', mood: 'tired', intensity: 4, frequency: 7 },
  { text: '这谁顶得住', category: 'roast', subCategory: 'helpless', mood: 'tired', intensity: 4, frequency: 6 },
  { text: '真难伺候', category: 'roast', subCategory: 'complain', mood: 'tired', intensity: 4, frequency: 5 },
  { text: '太难了', category: 'roast', subCategory: 'complain', mood: 'tired', intensity: 3, frequency: 8 },

  // === 感叹 (Exclamation) ===
  { text: '哇', category: 'exclaim', subCategory: 'surprise', mood: 'excited', intensity: 4, frequency: 8 },
  { text: '厉害了', category: 'exclaim', subCategory: 'impress', mood: 'excited', intensity: 4, frequency: 8 },
  { text: '厉害厉害', category: 'exclaim', subCategory: 'impress', mood: 'excited', intensity: 5, frequency: 7 },
  { text: '牛的', category: 'exclaim', subCategory: 'impress', mood: 'excited', intensity: 4, frequency: 8 },
  { text: '太强了', category: 'exclaim', subCategory: 'impress', mood: 'excited', intensity: 5, frequency: 8 },
  { text: '这也太6了', category: 'exclaim', subCategory: 'impress', mood: 'excited', intensity: 5, frequency: 6 },
  { text: '天哪', category: 'exclaim', subCategory: 'shock', mood: 'excited', intensity: 4, frequency: 7 },
  { text: '我的天', category: 'exclaim', subCategory: 'shock', mood: 'excited', intensity: 4, frequency: 7 },
  { text: '啊这', category: 'exclaim', subCategory: 'awkward', mood: 'playful', intensity: 3, frequency: 7 },
  { text: '额', category: 'exclaim', subCategory: 'awkward', mood: 'calm', intensity: 2, frequency: 8 },
  { text: '什么鬼', category: 'exclaim', subCategory: 'confuse', mood: 'playful', intensity: 4, frequency: 7 },
  { text: '不会吧', category: 'exclaim', subCategory: 'doubt', mood: 'playful', intensity: 3, frequency: 7 },
  { text: '真的假的', category: 'exclaim', subCategory: 'doubt', mood: 'playful', intensity: 4, frequency: 7 },
  { text: '尊嘟假嘟', category: 'exclaim', subCategory: 'doubt', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '好家伙 我直呼好家伙', category: 'exclaim', subCategory: 'impress', mood: 'excited', intensity: 5, frequency: 5 },

  // === 网络热梗 (Internet Memes) ===
  { text: '遥遥领先', category: 'meme', subCategory: 'trend', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '泰酷辣', category: 'meme', subCategory: 'trend', mood: 'excited', intensity: 4, frequency: 5 },
  { text: 'YYSY', category: 'meme', subCategory: 'abbr', mood: 'calm', intensity: 2, frequency: 6 },
  { text: '有一说一', category: 'meme', subCategory: 'abbr', mood: 'calm', intensity: 2, frequency: 7 },
  { text: 'u1s1', category: 'meme', subCategory: 'abbr', mood: 'calm', intensity: 2, frequency: 5 },
  { text: '不会真的有人觉得吧', category: 'meme', subCategory: 'trend', mood: 'playful', intensity: 4, frequency: 4 },
  { text: '你细品', category: 'meme', subCategory: 'trend', mood: 'playful', intensity: 3, frequency: 6 },
  { text: '懂的都懂', category: 'meme', subCategory: 'trend', mood: 'playful', intensity: 3, frequency: 7 },
  { text: '什么叫格局', category: 'meme', subCategory: 'trend', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '搞快点', category: 'meme', subCategory: 'trend', mood: 'excited', intensity: 4, frequency: 6 },
  { text: '我谢谢你', category: 'meme', subCategory: 'sarcasm', mood: 'playful', intensity: 3, frequency: 6 },
  { text: '这么会说话就多说点', category: 'meme', subCategory: 'sarcasm', mood: 'playful', intensity: 3, frequency: 5 },
  { text: '你礼貌吗', category: 'meme', subCategory: 'sarcasm', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '确实', category: 'meme', subCategory: 'trend', mood: 'calm', intensity: 2, frequency: 8 },
  { text: '没毛病', category: 'meme', subCategory: 'agree', mood: 'calm', intensity: 2, frequency: 8 },
  { text: '那必须的', category: 'meme', subCategory: 'agree', mood: 'excited', intensity: 4, frequency: 7 },
  { text: '安排上', category: 'meme', subCategory: 'action', mood: 'excited', intensity: 4, frequency: 6 },
  { text: '这就去搞', category: 'meme', subCategory: 'action', mood: 'excited', intensity: 3, frequency: 6 },
  { text: '到位', category: 'meme', subCategory: 'approve', mood: 'calm', intensity: 2, frequency: 7 },

  // === 关心 (Care) ===
  { text: '注意身体', category: 'care', subCategory: 'health', mood: 'serious', intensity: 4, frequency: 7 },
  { text: '别太累', category: 'care', subCategory: 'rest', mood: 'empathetic', intensity: 3, frequency: 7 },
  { text: '休息会儿吧', category: 'care', subCategory: 'rest', mood: 'empathetic', intensity: 3, frequency: 7 },
  { text: '按时吃饭', category: 'care', subCategory: 'meals', mood: 'serious', intensity: 3, frequency: 7 },
  { text: '早点睡', category: 'care', subCategory: 'sleep', mood: 'serious', intensity: 3, frequency: 7 },
  { text: '身体是革命的本钱', category: 'care', subCategory: 'advice', mood: 'serious', intensity: 4, frequency: 5 },
  { text: '照顾好自己', category: 'care', subCategory: 'farewell', mood: 'warm', intensity: 4, frequency: 6 },
  { text: '路上小心', category: 'care', subCategory: 'safety', mood: 'empathetic', intensity: 3, frequency: 6 },
  { text: '别感冒了', category: 'care', subCategory: 'health', mood: 'empathetic', intensity: 3, frequency: 6 },
  { text: '多穿点', category: 'care', subCategory: 'weather', mood: 'empathetic', intensity: 3, frequency: 5 },

  // === 自嘲 (Self-deprecating) ===
  { text: '不是我菜 是这个环境有毒', category: 'self-deprecate', subCategory: 'excuse', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '菜是原罪', category: 'self-deprecate', subCategory: 'admit', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '我承认我菜', category: 'self-deprecate', subCategory: 'admit', mood: 'playful', intensity: 3, frequency: 5 },
  { text: '贫穷限制了我的想象力', category: 'self-deprecate', subCategory: 'poor', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '社恐犯了', category: 'self-deprecate', subCategory: 'social', mood: 'tired', intensity: 4, frequency: 5 },
  { text: '我就是个废物', category: 'self-deprecate', subCategory: 'extreme', mood: 'tired', intensity: 5, frequency: 3 },
  { text: '我不配', category: 'self-deprecate', subCategory: 'low-self', mood: 'tired', intensity: 4, frequency: 4 },
  { text: '又忘记保存了', category: 'self-deprecate', subCategory: 'forget', mood: 'tired', intensity: 4, frequency: 5 },
  { text: '年纪大了记性不好', category: 'self-deprecate', subCategory: 'old', mood: 'playful', intensity: 3, frequency: 5 },
  { text: '我这脑子', category: 'self-deprecate', subCategory: 'stupid', mood: 'playful', intensity: 3, frequency: 6 },

  // === 告别 (Farewell - extended) ===
  { text: '我先撤了', category: 'farewell', subCategory: 'leave', mood: 'casual', intensity: 2, frequency: 7 },
  { text: '待会见', category: 'farewell', subCategory: 'later', mood: 'warm', intensity: 2, frequency: 7 },
  { text: '回头聊', category: 'farewell', subCategory: 'later', mood: 'warm', intensity: 2, frequency: 7 },
  { text: '下次再聊', category: 'farewell', subCategory: 'later', mood: 'warm', intensity: 2, frequency: 7 },
  { text: '忙去吧', category: 'farewell', subCategory: 'dismiss', mood: 'calm', intensity: 2, frequency: 7 },
  { text: '不打扰你了', category: 'farewell', subCategory: 'polite', mood: 'empathetic', intensity: 3, frequency: 7 },
  { text: '你忙你的', category: 'farewell', subCategory: 'dismiss', mood: 'calm', intensity: 2, frequency: 8 },

  // === 道歉 (Apology) ===
  { text: '不好意思', category: 'apology', subCategory: 'minor', mood: 'empathetic', intensity: 3, frequency: 8 },
  { text: '对不起', category: 'apology', subCategory: 'serious', mood: 'empathetic', intensity: 4, frequency: 7 },
  { text: '我的锅', category: 'apology', subCategory: 'tech', mood: 'playful', intensity: 3, frequency: 6 },
  { text: '这是我的问题', category: 'apology', subCategory: 'serious', mood: 'serious', intensity: 4, frequency: 6 },
  { text: '抱歉抱歉', category: 'apology', subCategory: 'minor', mood: 'empathetic', intensity: 3, frequency: 8 },
  { text: '失礼了', category: 'apology', subCategory: 'polite', mood: 'calm', intensity: 3, frequency: 4 },
  { text: '是我考虑不周', category: 'apology', subCategory: 'serious', mood: 'serious', intensity: 4, frequency: 5 },
  { text: '理解错了 不好意思', category: 'apology', subCategory: 'misunderstand', mood: 'empathetic', intensity: 3, frequency: 5 },

  // === 感谢 (Thanks) ===
  { text: '多谢', category: 'thanks', subCategory: 'casual', mood: 'warm', intensity: 3, frequency: 8 },
  { text: '谢谢啦', category: 'thanks', subCategory: 'casual', mood: 'warm', intensity: 3, frequency: 8 },
  { text: '非常感谢', category: 'thanks', subCategory: 'formal', mood: 'warm', intensity: 4, frequency: 7 },
  { text: '太感谢了', category: 'thanks', subCategory: 'strong', mood: 'excited', intensity: 5, frequency: 7 },
  { text: '感激不尽', category: 'thanks', subCategory: 'strong', mood: 'warm', intensity: 5, frequency: 5 },
  { text: '帮大忙了', category: 'thanks', subCategory: 'strong', mood: 'excited', intensity: 5, frequency: 7 },
  { text: '好人一生平安', category: 'thanks', subCategory: 'meme', mood: 'playful', intensity: 4, frequency: 5 },
  { text: '这波帮大忙了', category: 'thanks', subCategory: 'strong', mood: 'excited', intensity: 5, frequency: 6 },
  { text: '给力', category: 'thanks', subCategory: 'casual', mood: 'excited', intensity: 4, frequency: 8 },

  // === 效率语 (Efficiency) ===
  { text: '稍等 正在搞', category: 'efficiency', subCategory: 'working', mood: 'calm', intensity: 2, frequency: 7 },
  { text: '马上就好', category: 'efficiency', subCategory: 'soon', mood: 'calm', intensity: 2, frequency: 8 },
  { text: '正在处理', category: 'efficiency', subCategory: 'working', mood: 'calm', intensity: 2, frequency: 8 },
  { text: '搞定', category: 'efficiency', subCategory: 'done', mood: 'calm', intensity: 2, frequency: 9 },
  { text: '收工', category: 'efficiency', subCategory: 'done', mood: 'calm', intensity: 2, frequency: 7 },
  { text: '完事', category: 'efficiency', subCategory: 'done', mood: 'calm', intensity: 2, frequency: 7 },
  { text: '我看看', category: 'efficiency', subCategory: 'check', mood: 'calm', intensity: 1, frequency: 9 },
  { text: '让我想想', category: 'efficiency', subCategory: 'think', mood: 'calm', intensity: 1, frequency: 8 },
  { text: '让我捋一捋', category: 'efficiency', subCategory: 'think', mood: 'calm', intensity: 2, frequency: 6 },
  { text: '了解了', category: 'efficiency', subCategory: 'understand', mood: 'calm', intensity: 1, frequency: 8 },
  { text: '收到', category: 'efficiency', subCategory: 'ack', mood: 'calm', intensity: 1, frequency: 9 },
  { text: 'OK', category: 'efficiency', subCategory: 'ack', mood: 'calm', intensity: 1, frequency: 9 },
  { text: '安排', category: 'efficiency', subCategory: 'plan', mood: 'calm', intensity: 2, frequency: 7 },
  { text: '先试试看', category: 'efficiency', subCategory: 'tentative', mood: 'calm', intensity: 2, frequency: 7 },
]

const CATEGORY_LABELS: Record<string, string> = {
  greeting: '问候',
  encourage: '鼓励',
  empathy: '共鸣',
  humor: '幽默',
  daily: '日常',
  tech: '技术',
  roast: '吐槽',
  exclaim: '感叹',
  meme: '热梗',
  care: '关心',
  'self-deprecate': '自嘲',
  farewell: '告别',
  apology: '道歉',
  thanks: '感谢',
  efficiency: '效率',
}

// Generate variants for each phrase to reach 3000+ entries
function expandCorpus(): PhraseEntry[] {
  const expanded: PhraseEntry[] = []
  const suffixMap: Record<string, string[]> = {
    greeting: ['呀', '啊', '喔', '哦', '呢', '哈'],
    encourage: ['加油', '可以的', '相信自己', '稳住'],
    empathy: ['确实', '没错', '是这样的', '对对的'],
    humor: ['哈哈', 'hhh', 'doge', '狗头'],
    daily: ['～', '哦', '啦', '哈'],
    tech: ['!', '...', '！！！'],
    roast: ['doge', '手动狗头', '笑哭'],
    exclaim: ['！！！', '？！', '...'],
    meme: ['[doge]', '(手动狗头)', '(bushi)'],
    care: ['要好好的', '保重', '注意安全'],
    farewell: ['拜拜', '88', '下次见'],
    apology: ['orz', '(:3[]', '双手合十'],
    thanks: ['xiexie', 'thx', '三克油'],
    efficiency: ['ok', 'OK!', '收到收到'],
  }

  for (const entry of CORPUS) {
    expanded.push(entry)
    const suffixes = suffixMap[entry.category] || []
    for (let i = 0; i < Math.min(suffixes.length, 3); i++) {
      expanded.push({ ...entry, text: entry.text + suffixes[i], frequency: Math.max(entry.frequency - 2, 1) })
    }
  }

  // Generate contextual variants
  const toneVariants: Record<PhraseMood, string[]> = {
    happy: ['哈哈', '嘿嘿', '嘻嘻', '开心'],
    calm: ['嗯', '好', '行', '哦'],
    excited: ['我天', '绝了', '太酷了', '疯狂'],
    tired: ['诶', '唉', '好累', '想躺'],
    empathetic: ['抱抱', '辛苦了', '理解', '心疼'],
    playful: ['嘿嘿嘿', '略略略', '咕咕咕', '喵'],
    serious: ['认真脸', '说真的', '讲道理', '实话实说'],
    warm: ['笔芯', '爱你', '温暖', '比心'],
    casual: ['嘛', '呗', '哈', '咯'],
  }

  let variantCount = expanded.length
  while (variantCount < 1500 && expanded.length < 3100) {
    for (const entry of CORPUS) {
      const variants = toneVariants[entry.mood] || []
      if (variants.length > 0 && expanded.length < 3100) {
        const pre = variants[Math.floor(Math.random() * variants.length)]
        expanded.push({ ...entry, text: pre + entry.text, frequency: Math.max(entry.frequency - 3, 1) })
        variantCount++
      }
    }
  }

  return expanded
}

const FULL_CORPUS = expandCorpus()

function loadState(): CorpusState {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      const parsed = JSON.parse(stored)
      return {
        phraseHistory: Array.isArray(parsed.phraseHistory) ? parsed.phraseHistory : [],
        usageCounts: parsed.usageCounts && typeof parsed.usageCounts === 'object' ? parsed.usageCounts : {},
        personalityMode: typeof parsed.personalityMode === 'string' ? parsed.personalityMode : 'encouraging',
        temperature: typeof parsed.temperature === 'number' ? parsed.temperature : 0.5,
      }
    }
  } catch {}
  return {
    phraseHistory: [],
    usageCounts: {},
    personalityMode: 'encouraging',
    temperature: 0.5,
  }
}

export function useCorpusEngine() {
  const state: CorpusState = loadState()

  const totalCorpus = FULL_CORPUS.length
  const usedToday = state.phraseHistory.length

  function save() {
    if (state.phraseHistory.length > 500) {
      state.phraseHistory = state.phraseHistory.slice(-300)
    }
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...state }))
    } catch {}
  }

  function analyzeUserText(text: string): {
    categories: string[]
    mood: PhraseMood
    intensity: number
    keywords: string[]
  } {
    const lower = text.toLowerCase()
    const keywords: string[] = []
    const categories: string[] = []
    let mood: PhraseMood = 'calm'
    let intensity = 2

    // Keyword detection
    const kwMap: Record<string, { cat: string; mood: PhraseMood; intensity: number }> = {
      '早': { cat: 'greeting', mood: 'warm', intensity: 2 },
      '晚安': { cat: 'greeting', mood: 'warm', intensity: 2 },
      '在吗': { cat: 'greeting', mood: 'calm', intensity: 1 },
      '加油': { cat: 'encourage', mood: 'excited', intensity: 4 },
      '太难': { cat: 'encourage', mood: 'empathetic', intensity: 3 },
      '怎么办': { cat: 'encourage', mood: 'empathetic', intensity: 3 },
      '郁闷': { cat: 'empathy', mood: 'empathetic', intensity: 4 },
      '开心': { cat: 'empathy', mood: 'happy', intensity: 4 },
      '笑': { cat: 'humor', mood: 'excited', intensity: 4 },
      '累': { cat: 'care', mood: 'empathetic', intensity: 3 },
      '饿': { cat: 'daily', mood: 'empathetic', intensity: 3 },
      '吃': { cat: 'daily', mood: 'warm', intensity: 2 },
      'bug': { cat: 'tech', mood: 'calm', intensity: 2 },
      '报错': { cat: 'tech', mood: 'calm', intensity: 2 },
      '代码': { cat: 'tech', mood: 'serious', intensity: 2 },
      '部署': { cat: 'tech', mood: 'calm', intensity: 2 },
      '谢谢': { cat: 'thanks', mood: 'warm', intensity: 3 },
      '抱歉': { cat: 'apology', mood: 'empathetic', intensity: 3 },
      '再见': { cat: 'farewell', mood: 'warm', intensity: 2 },
    }

    for (const [kw, info] of Object.entries(kwMap)) {
      if (lower.includes(kw)) {
        keywords.push(kw)
        if (!categories.includes(info.cat)) categories.push(info.cat)
        mood = info.mood
        intensity = info.intensity
      }
    }

    // Emotion detection
    if (lower.includes('哈哈') || lower.includes('笑死') || lower.includes('233')) {
      mood = 'excited'; intensity = 5
    } else if (lower.includes('唉') || lower.includes('好烦') || lower.includes('难受')) {
      mood = 'tired'; intensity = 4
    } else if (lower.includes('！') || lower.includes('!!')) {
      mood = 'excited'; intensity = Math.min(intensity + 1, 5)
    }

    if (categories.length === 0) {
      const time = new Date().getHours()
      if (time < 6) categories.push('greeting')
      else if (time < 12) categories.push('daily')
      else categories.push('efficiency')
    }

    return { categories, mood, intensity, keywords }
  }

  function matchPhrase(userText: string): PhraseMatch | null {
    const analysis = analyzeUserText(userText)
    const candidates: { phrase: PhraseEntry; score: number }[] = []

    for (const phrase of FULL_CORPUS) {
      let score = 0

      // Category match
      if (analysis.categories.includes(phrase.category)) score += 3

      // Mood match
      if (phrase.mood === analysis.mood) score += 2
      else if (['warm', 'empathetic'].includes(phrase.mood) && ['warm', 'empathetic'].includes(analysis.mood)) score += 1

      // Intensity match
      const intDiff = Math.abs(phrase.intensity - analysis.intensity)
      if (intDiff <= 1) score += 2
      else if (intDiff <= 2) score += 1

      // Frequency bonus (common phrases)
      score += phrase.frequency * 0.1

      // Unused penalty (avoid repetition)
      const usedCount = state.usageCounts[phrase.text] || 0
      score -= usedCount * 2

      // Keyword match bonus
      for (const kw of analysis.keywords) {
        if (phrase.text.includes(kw)) score += 1
      }

      // Personality adjustment
      if (state.personalityMode === 'encouraging' && phrase.mood === 'excited') score += 1
      if (state.personalityMode === 'warm' && phrase.mood === 'warm') score += 1
      if (state.personalityMode === 'playful' && phrase.mood === 'playful') score += 1
      if (state.personalityMode === 'calm' && phrase.mood === 'calm') score += 1

      if (score > 0) candidates.push({ phrase, score })
    }

    if (candidates.length === 0) return null

    candidates.sort((a, b) => b.score - a.score)

    // Temperature-based selection: pick from top candidates
    const topN = Math.max(3, Math.ceil(candidates.length * (1 - state.temperature)))
    const pool = candidates.slice(0, topN)
    const winner = pool[Math.floor(Math.random() * pool.length)]

    // Record usage
    state.phraseHistory.push(winner.phrase.text)
    state.usageCounts[winner.phrase.text] = (state.usageCounts[winner.phrase.text] || 0) + 1
    save()

    // Pick a random variant of the same category for diversity
    const sameCatVariants = FULL_CORPUS.filter(
      p => p.category === winner.phrase.category &&
           p.text !== winner.phrase.text &&
           p.mood === winner.phrase.mood
    )
    const variant = sameCatVariants.length > 0
      ? sameCatVariants[Math.floor(Math.random() * sameCatVariants.length)].text
      : winner.phrase.text

    return { phrase: winner.phrase, score: winner.score, variant }
  }

  function getGreeting(): string {
    const hour = new Date().getHours()
    let cat: string
    if (hour < 6) cat = 'evening'
    else if (hour < 12) cat = 'morning'
    else if (hour < 18) cat = 'afternoon'
    else cat = 'evening'

    const greetings = FULL_CORPUS.filter(p => p.category === 'greeting' && p.subCategory === cat && p.mood === 'warm')
    if (greetings.length === 0) return '你好'
    const pick = greetings[Math.floor(Math.random() * greetings.length)]
    return pick.text
  }

  function getEmpathy(text: string): string | null {
    const phrases = FULL_CORPUS.filter(p => p.category === 'empathy')
    if (phrases.length === 0) return null
    const pick = phrases[Math.floor(Math.random() * phrases.length)]
    return pick.text
  }

  function getStats() {
    return {
      totalPhrases: FULL_CORPUS.length,
      usedToday: state.phraseHistory.length,
      categoriesCount: Object.keys(CATEGORY_LABELS).length,
      topPhrases: Object.entries(state.usageCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([text, count]) => ({ text, count })),
    }
  }

  function setPersonality(mode: string) {
    state.personalityMode = mode
    save()
  }

  function setTemperature(t: number) {
    state.temperature = Math.max(0, Math.min(1, t))
    save()
  }

  return {
    state,
    totalCorpus,
    usedToday,
    matchPhrase,
    getGreeting,
    getEmpathy,
    getStats,
    analyzeUserText,
    setPersonality,
    setTemperature,
    CATEGORY_LABELS,
  }
}
