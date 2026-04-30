// PostPage.tsx
import React from "react";
import {
  CalendarDays,
  MapPin,
  Users,
  Plane,
  Coffee,
  Camera,
  Clock,
  Battery,
  Wifi,
  AlertCircle,
  CheckCircle2,
  ArrowRight,
  Share2,
  Heart,
  BookmarkPlus,
  UserPlus,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
// import { Progress } from "@/components/ui/progress";
// import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Sample data for the travel buddy post
const postData = {
  id: 1,
  title: "寻找旅伴：探索日本隐藏的秘境 — 四国遍路+濑户内艺术祭",
  author: {
    name: "Alex Chen",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&h=150&fit=crop",
    joinDate: "2023",
    trips: 12,
  },
  coverImage:
    "https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?w=1200&h=600&fit=crop",
  destination: "日本四国 & 濑户内海",
  duration: "12天",
  startDate: "2024年10月15日",
  endDate: "2024年10月26日",
  groupSize: { current: 2, max: 4 },
  budget: {
    total: 2500,
    currency: "USD",
    includes: ["住宿", "部分交通", "景点门票"],
    excludes: ["国际机票", "餐饮", "个人购物"],
  },
  itinerary: [
    {
      day: 1,
      title: "高松集合 | 栗林公园 & 屋台晚餐",
      description:
        "抵达高松，游览米其林三星庭园栗林公园，晚上体验当地屋台美食。",
    },
    {
      day: 2,
      title: "直岛 | 地中美术馆 & 草间弥生南瓜",
      description:
        "乘船前往艺术之岛直岛，参观安藤忠雄设计的地中美术馆和标志性南瓜。",
    },
    {
      day: 3,
      title: "丰岛 | 丰岛美术馆 & 海边自行车",
      description: "骑行探索丰岛，感受水滴形美术馆与自然的融合。",
    },
    {
      day: 4,
      title: "德岛 | 涡潮观览 & 阿波舞",
      description: "参观鸣门涡潮，晚上欣赏热情的阿波舞表演。",
    },
    {
      day: 5,
      title: "高知 | 日曜市集 & 桂滨海滩",
      description: "逛日本最大的周日露天市场，傍晚到桂滨看日落。",
    },
    {
      day: 6,
      title: "松山 | 道后温泉 & 松山城",
      description: "浸泡日本最古老的道后温泉，乘坐索道登顶松山城。",
    },
    {
      day: 7,
      title: "大步危峡 | 游船 & 祖谷藤桥",
      description: "深入四国山区，体验大步危峡谷游船和惊险的祖谷藤桥。",
    },
    {
      day: 8,
      title: "金刀比罗宫 | 1368级台阶的朝圣",
      description: "攀登至金刀比罗宫奥社，俯瞰赞岐平原。",
    },
    {
      day: 9,
      title: "小豆岛 | 橄榄公园 & 天使之路",
      description: "前往小豆岛，漫步橄榄公园和一天只出现两次的天使之路。",
    },
    {
      day: 10,
      title: "男木岛 & 女木岛 | 艺术装置探索",
      description: "探访濑户内艺术祭的小岛，寻找散落的艺术装置。",
    },
    {
      day: 11,
      title: "高松 | 购物 & 欢送晚餐",
      description: "最后购物日，晚间一起享用四国乡土料理。",
    },
    {
      day: 12,
      title: "解散 | 返程或继续旅行",
      description: "早餐后解散，可结伴前往大阪或返回。",
    },
  ],
  requirements: [
    "热爱探索小众目的地，不赶景点",
    "能够接受每天步行15,000步以上",
    "对艺术和自然风光有兴趣",
    "具备基本英语或日语沟通能力",
    "愿意分担团队任务（如查路线、订餐等）",
  ],
  perks: [
    "已有详细行程计划和预算表",
    "我会负责预订住宿和交通（可一起讨论）",
    "旅途中互相拍照，记录精彩瞬间",
    "分享旅行摄影技巧",
  ],
  tags: ["深度游", "艺术祭", "温泉", "徒步", "摄影"],
};

const PostPage: React.FC = () => {
  const spotsLeft = postData.groupSize.max - postData.groupSize.current;
  const joinPercentage =
    (postData.groupSize.current / postData.groupSize.max) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section with Cover Image */}
      <div className="relative h-[50vh] w-full overflow-hidden md:h-[60vh]">
        <img
          src={postData.coverImage}
          alt={postData.destination}
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
        <div className="absolute right-0 bottom-0 left-0 p-6 text-white md:p-10">
          <div className="container mx-auto max-w-6xl">
            <Badge
              variant="secondary"
              className="mb-3 border-0 bg-white/20 text-white backdrop-blur-sm"
            >
              正在召集旅伴
            </Badge>
            <h1 className="mb-2 text-3xl font-bold drop-shadow-lg md:text-5xl">
              {postData.title}
            </h1>
            <div className="mt-3 flex flex-wrap gap-4 text-sm md:text-base">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4" />
                <span>{postData.destination}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <CalendarDays className="h-4 w-4" />
                <span>
                  {postData.startDate} - {postData.endDate} ·{" "}
                  {postData.duration}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Users className="h-4 w-4" />
                <span>剩 {spotsLeft} 个名额</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto max-w-6xl px-4 py-8 md:py-12">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          {/* Left Column - Main Post Content */}
          <div className="space-y-8 lg:col-span-2">
            {/* Author & Actions Card */}
            <Card>
              <CardContent className="p-6">
                <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="flex items-center gap-4">
                    <Avatar className="border-primary h-14 w-14 border-2">
                      <AvatarImage src={postData.author.avatar} />
                      <AvatarFallback>AC</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-lg font-semibold">
                        {postData.author.name}
                      </p>
                      <p className="text-muted-foreground text-sm">
                        加入 {postData.author.joinDate} ·{" "}
                        {postData.author.trips} 次旅行
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm">
                      <MessageCircle className="mr-2 h-4 w-4" />
                      私信
                    </Button>
                    <Button variant="outline" size="sm">
                      <UserPlus className="mr-2 h-4 w-4" />
                      关注
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Travel Style Tags */}
            <div className="flex flex-wrap gap-2">
              {postData.tags.map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="bg-blue-100 text-blue-800 hover:bg-blue-200"
                >
                  #{tag}
                </Badge>
              ))}
            </div>

            {/* Quick Info Grid */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Users className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">团队规模</p>
                    <p className="font-semibold">
                      {postData.groupSize.current}/{postData.groupSize.max} 人
                    </p>
                    {/* <Progress
                      value={joinPercentage}
                      className="mt-1 h-1.5 w-32"
                    /> */}
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="flex items-center gap-3 p-4">
                  <div className="bg-primary/10 rounded-full p-2">
                    <Clock className="text-primary h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-muted-foreground text-sm">旅行时长</p>
                    <p className="font-semibold">
                      {postData.duration} · {postData.startDate}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Budget Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span>💰 预算概览</span>
                  <Badge variant="outline">
                    预估每人 {postData.budget.currency} {postData.budget.total}
                  </Badge>
                </CardTitle>
                <CardDescription>不含国际机票，弹性较高</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-sm font-medium text-green-600">
                      <CheckCircle2 className="h-4 w-4" /> 费用包含
                    </p>
                    <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                      {postData.budget.includes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 flex items-center gap-1 text-sm font-medium text-amber-600">
                      <AlertCircle className="h-4 w-4" /> 不包含
                    </p>
                    <ul className="text-muted-foreground list-inside list-disc space-y-1 text-sm">
                      {postData.budget.excludes.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Itinerary Tabs */}
            <Card>
              <CardHeader>
                <CardTitle>🗺️ 详细行程规划</CardTitle>
                <CardDescription>
                  共 {postData.itinerary.length} 天，深度探索四国与濑户内海
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="day1" className="w-full">
                  <TabsList className="flex h-auto flex-wrap gap-1 bg-transparent">
                    {postData.itinerary.slice(0, 6).map((day) => (
                      <TabsTrigger
                        key={day.day}
                        value={`day${day.day}`}
                        className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                      >
                        D{day.day}
                      </TabsTrigger>
                    ))}
                    <TabsTrigger
                      value="more"
                      className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                    >
                      D7-D12
                    </TabsTrigger>
                  </TabsList>
                  {postData.itinerary.slice(0, 6).map((day) => (
                    <TabsContent
                      key={day.day}
                      value={`day${day.day}`}
                      className="mt-4"
                    >
                      <div className="space-y-2">
                        <h3 className="flex items-center gap-2 text-lg font-semibold">
                          <span className="bg-primary/20 text-primary inline-flex h-6 w-6 items-center justify-center rounded-full text-sm">
                            D{day.day}
                          </span>
                          {day.title}
                        </h3>
                        <p className="text-muted-foreground">
                          {day.description}
                        </p>
                      </div>
                    </TabsContent>
                  ))}
                  <TabsContent value="more" className="mt-4">
                    <div className="max-h-96 space-y-4 overflow-y-auto pr-2">
                      {postData.itinerary.slice(6).map((day) => (
                        <div
                          key={day.day}
                          className="border-b pb-3 last:border-0"
                        >
                          <h4 className="flex items-center gap-2 font-medium">
                            <span className="bg-muted inline-flex h-5 w-5 items-center justify-center rounded-full text-xs">
                              D{day.day}
                            </span>
                            {day.title}
                          </h4>
                          <p className="text-muted-foreground mt-1 text-sm">
                            {day.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
              <CardFooter>
                <Button variant="ghost" size="sm" className="w-full">
                  查看完整PDF行程 <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>

            {/* Requirements & Perks */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <Card className="border-amber-200 bg-amber-50/40">
                <CardHeader>
                  <CardTitle className="text-amber-800">👥 希望旅伴</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {postData.requirements.map((req, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="text-amber-600">•</span>
                        {req}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
              <Card className="border-green-200 bg-green-50/40">
                <CardHeader>
                  <CardTitle className="text-green-800">✨ 我能提供</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {postData.perks.map((perk, idx) => (
                      <li key={idx} className="flex gap-2 text-sm">
                        <span className="text-green-600">✓</span>
                        {perk}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Practical Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Battery className="h-5 w-5" /> 实用贴士
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div className="flex items-center gap-2">
                    <Wifi className="text-muted-foreground h-4 w-4" />{" "}
                    全程提供移动WiFi分享
                  </div>
                  <div className="flex items-center gap-2">
                    <Camera className="text-muted-foreground h-4 w-4" />{" "}
                    欢迎摄影爱好者，交流构图技巧
                  </div>
                  <div className="flex items-center gap-2">
                    <Plane className="text-muted-foreground h-4 w-4" />{" "}
                    建议飞抵高松机场或关西机场+JR PASS
                  </div>
                  <div className="flex items-center gap-2">
                    <Coffee className="text-muted-foreground h-4 w-4" />{" "}
                    会预留自由探索时间，不捆绑消费
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Sidebar / CTA */}
          <div className="space-y-6">
            {/* Sticky CTA Card */}
            <div className="sticky top-24">
              <Card className="border-primary/20 shadow-lg">
                <CardHeader className="bg-primary/5 rounded-t-lg">
                  <CardTitle className="text-center">✈️ 加入这趟旅程</CardTitle>
                  <CardDescription className="text-center">
                    还剩 {spotsLeft} 个位子
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4 pt-6">
                  <div className="text-center">
                    <p className="text-primary text-2xl font-bold">
                      ${postData.budget.total}
                    </p>
                    <p className="text-muted-foreground text-xs">
                      每人预估 (不含机票)
                    </p>
                  </div>
                  {/* <Separator /> */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>出发日期</span>
                      <span className="font-medium">{postData.startDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>返程日期</span>
                      <span className="font-medium">{postData.endDate}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>团队状态</span>
                      <span className="font-medium text-green-600">
                        招募中 · {spotsLeft}/2 空位
                      </span>
                    </div>
                  </div>
                  <Button className="w-full gap-2">
                    <UserPlus className="h-4 w-4" />
                    申请加入
                  </Button>
                  <Button variant="outline" className="w-full gap-2">
                    <Heart className="h-4 w-4" />
                    收藏帖子
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-muted-foreground w-full gap-2"
                  >
                    <Share2 className="h-4 w-4" />
                    分享给朋友
                  </Button>
                </CardContent>
                <CardFooter className="text-muted-foreground border-t pt-4 text-center text-xs">
                  报名后发起人会与您联系，简单沟通旅行习惯
                </CardFooter>
              </Card>

              {/* Similar trips suggestion */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-base">你可能也喜欢</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-md bg-cover bg-center"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1533105079780-92b9be482077?w=100&h=100&fit=crop')",
                      }}
                    ></div>
                    <div>
                      <p className="text-sm font-medium">尼泊尔ABC徒步</p>
                      <p className="text-muted-foreground text-xs">
                        10月 · 8天
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div
                      className="h-12 w-12 rounded-md bg-cover bg-center"
                      style={{
                        backgroundImage:
                          "url('https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=100&h=100&fit=crop')",
                      }}
                    ></div>
                    <div>
                      <p className="text-sm font-medium">意大利多洛米蒂</p>
                      <p className="text-muted-foreground text-xs">
                        9月 · 10天
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostPage;
