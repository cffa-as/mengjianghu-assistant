"use client"

import { useState, useMemo, useEffect, useCallback } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  BookOpen,
  Map,
  HelpCircle,
  MessageSquare,
  ExternalLink,
  Navigation,
  RotateCcw,
  MapPin,
  Search,
  Bot,
  Quote,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  Tag,
  Gift,
  Database,
  Star,
  StarOff,
  Info,
  Plus,
  Pencil,
  Trash2,
  Sun,
  Moon,
} from "lucide-react"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// 名人名言数据
const inspirationalQuotes = [
  "天行健，君子以自强不息；地势坤，君子以厚德载物。",
  "不鸣则已，一鸣惊人；不飞则已，一飞冲天。",
  "长风破浪会有时，直挂云帆济沧海。",
  "宝剑锋从磨砺出，梅花香自苦寒来。",
  "会当凌绝顶，一览众山小。",
  "千磨万击还坚劲，任尔东西南北风。",
  "天生我材必有用，千金散尽还复来。",
  "古之立大事者，不惟有超世之才，亦必有坚忍不拔之志。",
  "志不强者智不达，言不信者行不果。",
  "路漫漫其修远兮，吾将上下而求索。",
  "不经一番寒彻骨，怎得梅花扑鼻香。",
  "一日不练，自己知道；两日不练，教练知道；三日不练，观众知道。",
  "业精于勤，荒于嬉；行成于思，毁于随。",
  "玉不琢，不成器；人不学，不知道。",
  "苦海无边，回头是岸；放下屠刀，立地成佛。",
  "欲穷千里目，更上一层楼。"
]

// 移除预设的指令数据
const gameCommands = []

// 添加新的类型定义
type Command = {
  id: string
  name: string
  command: string
}

// 底部导航组件
function BottomNavigation({ activeTab, setActiveTab, theme }: { activeTab: string; setActiveTab: (tab: string) => void; theme: "light" | "dark" }) {
  const tabs = [
    { id: "commands", label: "指令", icon: BookOpen },
    { id: "dreamland", label: "梦墟", icon: Map },
    { id: "questions", label: "题库", icon: HelpCircle },
    { id: "common", label: "常用", icon: Database },
    { id: "gifts", label: "礼包", icon: Gift },
  ]

  return (
    <div className="fixed bottom-[calc(env(safe-area-inset-bottom)+20px)] left-0 right-0 px-4 py-2 z-50">
      <div className={`flex justify-around max-w-md mx-auto ${
        theme === "dark" 
          ? "bg-black/30 backdrop-blur-md border border-white/10" 
          : "bg-white/90 backdrop-blur-md border border-gray-200"
        } rounded-xl shadow-xl`}>
        {tabs.map((tab) => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center gap-1 px-3 py-2 rounded-lg transition-colors ${
                activeTab === tab.id 
                  ? theme === "dark" 
                    ? "text-blue-400 bg-white/10" 
                    : "text-blue-600 bg-blue-50"
                  : theme === "dark"
                    ? "text-gray-400 hover:text-gray-300" 
                    : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="text-xs font-medium">{tab.label}</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

// 指令页面组件
function CommandsPage({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [copiedCommand, setCopiedCommand] = useState("")
  // 使用数组而不是Set来跟踪展开的指令ID
  const [expandedCommands, setExpandedCommands] = useState<string[]>([])
  // 从本地存储加载指令
  const [commands, setCommands] = useState<Command[]>([])
  const [isAddingCommand, setIsAddingCommand] = useState(false)
  const [newCommand, setNewCommand] = useState<Partial<Command>>({
    name: "",
    command: "",
  })
  const [editingCommand, setEditingCommand] = useState<Command | null>(null)

  // 在客户端加载指令和状态
  useEffect(() => {
    // 加载指令
    const saved = localStorage.getItem("user-commands")
    if (saved) {
      // 处理旧格式的命令数据，只保留id、name和command字段
      const parsedCommands = JSON.parse(saved);
      setCommands(parsedCommands.map((cmd: any) => ({
        id: cmd.id,
        name: cmd.name,
        command: cmd.command
      })));
    }
  }, [])

  // 切换指令展开/折叠状态
  const toggleCommandExpand = (id: string) => {
    setExpandedCommands(prev => {
      if (prev.includes(id)) {
        return prev.filter(cmdId => cmdId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  // 保存指令到本地存储
  const saveCommands = useCallback((updatedCommands: Command[]) => {
    localStorage.setItem("user-commands", JSON.stringify(updatedCommands))
    setCommands(updatedCommands)
  }, [])

  // 添加新指令
  const addCommand = () => {
    if (!newCommand.name || !newCommand.command) return
    const command: Command = {
      id: Date.now().toString(),
      name: newCommand.name,
      command: newCommand.command,
    }
    saveCommands([...commands, command])
    setNewCommand({ name: "", command: "" })
    setIsAddingCommand(false)
  }

  // 更新指令
  const updateCommand = (command: Command) => {
    const updatedCommands = commands.map(c => c.id === command.id ? command : c)
    saveCommands(updatedCommands)
    setEditingCommand(null)
  }

  // 删除指令
  const deleteCommand = (id: string) => {
    const updatedCommands = commands.filter(c => c.id !== id)
    saveCommands(updatedCommands)
    // 从展开集合中移除
    setExpandedCommands(prev => prev.filter(cmdId => cmdId !== id))
  }

  // 复制指令
  const copyCommand = (command: string) => {
    navigator.clipboard.writeText(command)
    setCopiedCommand(command)
    setTimeout(() => setCopiedCommand(""), 2000)
  }

  // 过滤指令
  const filteredCommands = useMemo(() => {
    return commands.filter(cmd => {
      const matchesSearch = searchTerm === "" ||
        cmd.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        cmd.command.toLowerCase().includes(searchTerm.toLowerCase())

      return matchesSearch
    })
  }, [commands, searchTerm])

  // 检查指令是否展开
  const isCommandExpanded = (id: string) => {
    return expandedCommands.includes(id)
  }

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto space-y-4 pb-28">
        {/* 提示信息 */}
        <Card className={`${theme === "dark" 
          ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg text-white" 
          : "bg-white border-gray-200 shadow"}`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <Info className={`w-4 h-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"} mt-0.5 flex-shrink-0`} />
              <div className={`text-sm ${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>
                <p>您可以在这里管理自己的游戏指令，添加常用指令方便快速复制。点击指令名称可展开/折叠内容。</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 完整指令文档链接 */}
        <Card className={`${theme === "dark" 
          ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg text-white" 
          : "bg-white border-gray-200 shadow"}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-800"} text-sm`}>
              <BookOpen className={`w-4 h-4 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
              参考指令文档
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Button
              size="sm"
              className={`w-full ${theme === "dark" ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"}`}
              onClick={() => window.open("https://scnuju7foaj4.feishu.cn/wiki/CeNDwyh6kioR1rkG98ccFMR0nef", "_blank")}
            >
              <ExternalLink className="w-4 h-4 mr-2" />
              查看文档
            </Button>
          </CardContent>
        </Card>

        {/* 搜索和添加按钮 */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="搜索指令..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`pl-10 ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"}`}
            />
          </div>
          <Button onClick={() => setIsAddingCommand(true)} size="icon" variant="outline" className={`${theme === "dark" ? "border-white/20 bg-black/30 text-white hover:bg-white/10" : "border-gray-200 bg-white/80 text-gray-800 hover:bg-gray-100"}`}>
            <Plus className="h-4 w-4" />
          </Button>
        </div>

        {/* 指令列表 */}
        <div className="space-y-3">
          {filteredCommands.map((cmd) => (
            <Card key={cmd.id} className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div 
                        className="flex items-center gap-2 cursor-pointer hover:text-blue-400"
                        onClick={() => toggleCommandExpand(cmd.id)}
                      >
                        {isCommandExpanded(cmd.id) ? (
                          <ChevronDown className="w-4 h-4 flex-shrink-0 text-blue-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 flex-shrink-0 text-gray-400" />
                        )}
                        <span className={`font-medium text-sm ${theme === "dark" ? "text-white" : "text-gray-800"}`}>{cmd.name}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => setEditingCommand(cmd)}
                        className={`h-8 w-8 p-0 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-300 hover:text-gray-800 hover:bg-gray-100"}`}
                      >
                        <Pencil className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyCommand(cmd.command)}
                        className={`h-8 w-8 p-0 ${theme === "dark" ? "text-gray-300 hover:text-white hover:bg-white/10" : "text-gray-300 hover:text-gray-800 hover:bg-gray-100"}`}
                      >
                        {copiedCommand === cmd.command ? (
                          <Check className="w-3 h-3 text-green-500" />
                        ) : (
                          <Copy className="w-3 h-3" />
                        )}
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteCommand(cmd.id)}
                        className={`h-8 w-8 p-0 ${theme === "dark" ? "text-red-400 hover:text-red-300 hover:bg-white/10" : "text-red-400 hover:text-red-300 hover:bg-gray-100"}`}
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                  {isCommandExpanded(cmd.id) && (
                    <div className={`${theme === "dark" ? "bg-gray-900 text-green-500 text-xs p-2 rounded font-mono whitespace-pre-wrap border border-gray-800" : "bg-gray-100 text-green-600 text-xs p-2 rounded font-mono whitespace-pre-wrap border border-gray-200"}`}>{cmd.command}</div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredCommands.length === 0 && (
          <Card className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
            <CardContent className="pt-6 text-center text-gray-400">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>未找到相关指令</p>
            </CardContent>
          </Card>
        )}

        {/* 添加指令对话框 */}
        <Dialog open={isAddingCommand} onOpenChange={setIsAddingCommand}>
          <DialogContent className={`${theme === "dark" ? "bg-gray-900 text-white border-gray-700" : "bg-white border-gray-200 text-gray-800"}`}>
            <DialogHeader>
              <DialogTitle className={`${theme === "dark" ? "text-white" : "text-gray-800"}`}>添加新指令</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>指令名称</Label>
                <Input
                  value={newCommand.name}
                  onChange={(e) => setNewCommand({ ...newCommand, name: e.target.value })}
                  placeholder="例如：查看背包"
                  className={`${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"}`}
                />
              </div>
              <div className="space-y-2">
                <Label className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>指令内容</Label>
                <Textarea
                  value={newCommand.command}
                  onChange={(e) => setNewCommand({ ...newCommand, command: e.target.value })}
                  placeholder="例如：i"
                  className={`${theme === "dark" ? "min-h-[200px] font-mono bg-gray-800 border-gray-700 text-white" : "min-h-[200px] font-mono bg-white border-gray-200 text-gray-800"}`}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingCommand(false)} className={`${theme === "dark" ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-700 text-gray-600 hover:bg-gray-100"}`}>取消</Button>
              <Button onClick={addCommand} className={`${theme === "dark" ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"}`}>添加</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* 编辑指令对话框 */}
        <Dialog open={!!editingCommand} onOpenChange={(open) => !open && setEditingCommand(null)}>
          <DialogContent className={`${theme === "dark" ? "bg-gray-900 text-white border-gray-700" : "bg-white border-gray-200 text-gray-800"}`}>
            <DialogHeader>
              <DialogTitle className={`${theme === "dark" ? "text-white" : "text-gray-800"}`}>编辑指令</DialogTitle>
            </DialogHeader>
            {editingCommand && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>指令名称</Label>
                  <Input
                    value={editingCommand.name}
                    onChange={(e) => setEditingCommand({ ...editingCommand, name: e.target.value })}
                    className={`${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"}`}
                  />
                </div>
                <div className="space-y-2">
                  <Label className={`${theme === "dark" ? "text-gray-300" : "text-gray-600"}`}>指令内容</Label>
                  <Textarea
                    value={editingCommand.command}
                    onChange={(e) => setEditingCommand({ ...editingCommand, command: e.target.value })}
                    className={`${theme === "dark" ? "min-h-[200px] font-mono bg-gray-800 border-gray-700 text-white" : "min-h-[200px] font-mono bg-white border-gray-200 text-gray-800"}`}
                  />
                </div>
              </div>
            )}
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingCommand(null)} className={`${theme === "dark" ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-700 text-gray-600 hover:bg-gray-100"}`}>取消</Button>
              <Button onClick={() => editingCommand && updateCommand(editingCommand)} className={`${theme === "dark" ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"}`}>保存</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

// 梦墟导航组件
function DreamlandPage({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const locations = [
    "梦墟入口",
    "梦境小径",
    "梦墟",
    "白虎兵冢",
    "浮岛遗迹",
    "时之沙漏",
    "青龙之渊",
    "朱雀焚天",
    "墨鳞幽境",
    "玄武之碑",
    "星穹残响",
    "心像画廊",
    "海市书库",
    "熵之核心",
    "琴弦回廊",
    "齿轮天井",
    "星骸王座",
    "归墟之眼",
    "虚空织网",
    "熵寂回廊",
    "星髓矿脉",
  ]

  const connections: { [key: string]: string[] } = {
    梦墟入口: ["梦境小径"],
    梦境小径: ["梦墟入口", "梦墟", "白虎兵冢", "浮岛遗迹"],
    梦墟: ["梦境小径", "梦墟", "心像画廊", "玄武之碑", "星髓矿脉"],
    白虎兵冢: ["梦境小径", "时之沙漏", "朱雀焚天"],
    浮岛遗迹: ["梦境小径", "时之沙漏"],
    时之沙漏: ["浮岛遗迹", "白虎兵冢", "青龙之渊"],
    青龙之渊: ["时之沙漏", "琴弦回廊", "虚空织网"],
    朱雀焚天: ["白虎兵冢", "墨鳞幽境"],
    墨鳞幽境: ["朱雀焚天", "玄武之碑"],
    玄武之碑: ["墨鳞幽境", "星穹残响", "梦墟"],
    星穹残响: ["玄武之碑", "心像画廊", "星髓矿脉"],
    心像画廊: ["星穹残响", "海市书库", "梦墟"],
    海市书库: ["心像画廊", "熵之核心"],
    熵之核心: ["海市书库", "星骸王座", "熵寂回廊"],
    琴弦回廊: ["青龙之渊", "齿轮天井"],
    齿轮天井: ["琴弦回廊", "星骸王座"],
    星骸王座: ["齿轮天井", "熵之核心", "归墟之眼"],
    归墟之眼: ["星骸王座", "虚空织网", "星髓矿脉"],
    虚空织网: ["青龙之渊", "归墟之眼", "熵寂回廊"],
    熵寂回廊: ["虚空织网", "熵之核心"],
    星髓矿脉: ["梦墟", "星穹残响", "归墟之眼"],
  }

  const [startLocation, setStartLocation] = useState("")
  const [endLocation, setEndLocation] = useState("")
  const [path, setPath] = useState<string[]>([])
  const [openStart, setOpenStart] = useState(false)
  const [openEnd, setOpenEnd] = useState(false)

  function findShortestPath(start: string, end: string): string[] {
    if (start === end) return [start]
    const distances: { [key: string]: number } = {}
    const previous: { [key: string]: string | null } = {}
    const unvisited = new Set(locations)

    locations.forEach((location) => {
      distances[location] = location === start ? 0 : Number.POSITIVE_INFINITY
      previous[location] = null
    })

    while (unvisited.size > 0) {
      const current = Array.from(unvisited).reduce(
        (min, location) => (distances[location] < distances[min] ? location : min),
        Array.from(unvisited)[0],
      )

      if (distances[current] === Number.POSITIVE_INFINITY) break
      unvisited.delete(current)
      if (current === end) break

      const neighbors = connections[current] || []
      neighbors.forEach((neighbor) => {
        if (unvisited.has(neighbor)) {
          const newDistance = distances[current] + 1
          if (newDistance < distances[neighbor]) {
            distances[neighbor] = newDistance
            previous[neighbor] = current
          }
        }
      })
    }

    const pathResult: string[] = []
    let current: string | null = end
    while (current !== null) {
      pathResult.unshift(current)
      current = previous[current]
    }

    return pathResult[0] === start ? pathResult : []
  }

  const findPath = () => {
    if (startLocation && endLocation) {
      const shortestPath = findShortestPath(startLocation, endLocation)
      setPath(shortestPath)
    }
  }

  const reset = () => {
    setStartLocation("")
    setEndLocation("")
    setPath([])
  }

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto space-y-4 pb-28">
        <Card className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-800"} text-sm`}>
              <MapPin className={`w-5 h-5 ${theme === "dark" ? "text-purple-600" : "text-blue-600"}`} />
              梦墟地图
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`${theme === "dark" ? "bg-gray-50" : "bg-gray-100"} rounded-lg p-2`}>
              <img
                src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/3f13588ccba1187092eb17fb4d3507d2-9uDPj6dnM6XGqscpzdx8SOB3hznPiy.png"
                alt="梦墟地图"
                className="w-full h-auto rounded-lg shadow-sm"
              />
            </div>
          </CardContent>
        </Card>

        <Card className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
          <CardHeader>
            <CardTitle className={`flex items-center gap-2 ${theme === "dark" ? "text-white" : "text-gray-800"} text-sm`}>
              <Navigation className={`w-5 h-5 ${theme === "dark" ? "text-blue-600" : "text-blue-600"}`} />
              路径规划
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className={`${theme === "dark" ? "text-sm font-medium text-white" : "text-sm font-medium text-gray-800"}`}>起点</label>
              <Popover open={openStart} onOpenChange={setOpenStart}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={`${theme === "dark" ? "w-full justify-between bg-transparent" : "w-full justify-between bg-transparent"}`}>
                    {startLocation || "选择起点..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="搜索地点..." />
                    <CommandList>
                      <CommandEmpty>未找到地点</CommandEmpty>
                      <CommandGroup>
                        {locations.map((location) => (
                          <CommandItem
                            key={location}
                            value={location}
                            onSelect={() => {
                              setStartLocation(location)
                              setOpenStart(false)
                            }}
                          >
                            {location}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <label className={`${theme === "dark" ? "text-sm font-medium text-white" : "text-sm font-medium text-gray-800"}`}>终点</label>
              <Popover open={openEnd} onOpenChange={setOpenEnd}>
                <PopoverTrigger asChild>
                  <Button variant="outline" className={`${theme === "dark" ? "w-full justify-between bg-transparent" : "w-full justify-between bg-transparent"}`}>
                    {endLocation || "选择终点..."}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0">
                  <Command>
                    <CommandInput placeholder="搜索地点..." />
                    <CommandList>
                      <CommandEmpty>未找到地点</CommandEmpty>
                      <CommandGroup>
                        {locations.map((location) => (
                          <CommandItem
                            key={location}
                            value={location}
                            onSelect={() => {
                              setEndLocation(location)
                              setOpenEnd(false)
                            }}
                          >
                            {location}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            <div className="flex gap-2">
              <Button onClick={findPath} disabled={!startLocation || !endLocation} className="flex-1">
                <Navigation className="w-4 h-4 mr-2" />
                寻路
              </Button>
              <Button onClick={reset} variant="outline">
                <RotateCcw className="w-4 h-4" />
              </Button>
            </div>

            {path.length > 0 && (
              <div className="space-y-2">
                <label className={`${theme === "dark" ? "text-sm font-medium text-white" : "text-sm font-medium text-gray-800"}`}>最短路径 ({path.length - 1} 步)</label>
                <div className="space-y-1">
                  {path.map((location, index) => (
                    <div key={index} className="flex items-center gap-2">
                      <Badge
                        variant={index === 0 ? "default" : index === path.length - 1 ? "destructive" : "secondary"}
                        className="text-xs min-w-[24px] justify-center"
                      >
                        {index + 1}
                      </Badge>
                      <span className="text-sm">{location}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

// 题库页面组件
function QuestionsPage({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [questionsData, setQuestionsData] = useState<Array<[string, string]>>([])
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 10

  useEffect(() => {
    const loadQuestions = async () => {
      try {
        const response = await fetch("/questions.txt")
        const text = await response.text()

        // 解析txt文件内容
        const lines = text.split("\n").filter((line) => line.trim())
        const questions: Array<[string, string]> = []

        lines.forEach((line) => {
          // 匹配格式："问题":"答案",
          const match = line.match(/"([^"]+)":"([^"]+)"/)
          if (match) {
            questions.push([match[1], match[2]])
          }
        })

        setQuestionsData(questions)
      } catch (error) {
        console.error("Failed to load questions:", error)
        // 如果加载失败，使用一些示例数据
        const fallbackQuestions: Array<[string, string]> = [
          ["山有木兮木有枝", "心悦君兮君不知"],
          ["人生若只如初见", "何事秋风悲画扇"],
          ["十年生死两茫茫", "不思量，自难忘"],
        ]
        setQuestionsData(fallbackQuestions)
      } finally {
        setLoading(false)
      }
    }
    loadQuestions()
  }, [])

  const filteredQuestions = useMemo(() => {
    if (!searchTerm) return questionsData
    return questionsData.filter(
      ([question, answer]) =>
        question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        answer.toLowerCase().includes(searchTerm.toLowerCase()),
    )
  }, [searchTerm, questionsData])

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentQuestions = filteredQuestions.slice(startIndex, endIndex)

  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm])

  if (loading) {
    return (
      <div className="p-4">
        <div className="max-w-md mx-auto pb-28">
          <Card className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
            <CardContent className="pt-6 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className={`${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>加载题库中...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto space-y-4 pb-28">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="搜索题库..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"}`}
          />
        </div>

        <Card className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{filteredQuestions.length}</div>
                <div className="text-xs text-gray-600">{searchTerm ? "搜索结果" : "题目总数"}</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{currentPage}</div>
                <div className="text-xs text-gray-600">当前页</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-purple-600">{totalPages}</div>
                <div className="text-xs text-gray-600">总页数</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          {currentQuestions.map(([question, answer], index) => (
            <Card key={startIndex + index} className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-2">
                    <Badge variant="outline" className="text-xs min-w-[32px] justify-center">
                      {startIndex + index + 1}
                    </Badge>
                    <div className="text-sm font-medium leading-relaxed flex-1">{question}</div>
                  </div>
                  <div className="pl-10 text-sm text-gray-600 leading-relaxed border-l-2 border-blue-100">{answer}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <Card className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
            <CardContent className="pt-4">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                  className="h-7 px-2"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {Array.from({ length: Math.min(3, totalPages) }, (_, i) => {
                    let pageNum
                    if (totalPages <= 3) {
                      pageNum = i + 1
                    } else if (currentPage <= 2) {
                      pageNum = i + 1
                    } else if (currentPage >= totalPages - 1) {
                      pageNum = totalPages - 2 + i
                    } else {
                      pageNum = currentPage - 1 + i
                    }
                    return (
                      <Button
                        key={pageNum}
                        variant={currentPage === pageNum ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(pageNum)}
                        className="w-7 h-7 p-0 text-xs"
                      >
                        {pageNum}
                      </Button>
                    )
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                  disabled={currentPage === totalPages}
                  className="h-7 px-2"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {filteredQuestions.length === 0 && !loading && (
          <Card className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
            <CardContent className="pt-6 text-center text-gray-500">
              <Search className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>未找到相关题目</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

// 常用页面组件
function CommonPage({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const tables = {
    breakthrough: [
      { stage: "一段", requirement: "先天1500", materials: "大道10 天道10" },
      { stage: "二段", requirement: "先天1700", materials: "劫灰1 大道20 天道20" },
      { stage: "三段", requirement: "先天1900", materials: "劫灰2 大道20 天道20" },
      { stage: "四段", requirement: "先天2100", materials: "劫灰3 大道20 天道20" },
      { stage: "五段", requirement: "先天2300", materials: "劫灰4 大道20 天道20" },
      { stage: "六段", requirement: "先天2500", materials: "劫灰5 大道20 天道20" },
      { stage: "七段", requirement: "先天2700", materials: "劫灰6 大道20 天道20" },
      { stage: "八段", requirement: "先天2900", materials: "劫灰7 大道20 天道20" },
      { stage: "九段", requirement: "先天3100", materials: "劫灰8 大道20 天道20" },
      { stage: "十段", requirement: "先天3300", materials: "劫灰9 大道20 天道20" },
      { stage: "十一段", requirement: "先天3500", materials: "劫灰10 大道20 天道20" },
      { stage: "十二段", requirement: "先天3700", materials: "劫灰11 大道20 天道20" },
      { stage: "十三段", requirement: "先天3900", materials: "劫灰12 大道20 天道20" },
      { stage: "十四段", requirement: "先天4100", materials: "劫灰13 大道20 天道20" },
      { stage: "十五段", requirement: "先天4300", materials: "劫灰14 大道20 天道20" },
      { stage: "十六段", requirement: "先天4500", materials: "劫灰15 大道20 天道20" },
      { stage: "十七段", requirement: "先天4700", materials: "劫灰16 大道20 天道20" },
      { stage: "十八段", requirement: "先天4900", materials: "劫灰17 大道30 天道30" },
      { stage: "准圣", requirement: "总先天4999", materials: "劫灰18 大道18 天道18" },
      { stage: "圣人", requirement: "总先天8888", materials: "劫灰49 大道49 天道49" },
      { stage: "兵解圣人", requirement: "总先天一万", materials: "劫灰18（不推荐）" },
      { stage: "开天圣人", requirement: "总先天一万六", materials: "经验二十五亿 劫灰66" },
      { stage: "大道圣人", requirement: "总先天一万二", materials: "经验二十五亿 精神三千万 劫灰18" },
      { stage: "与道同行", requirement: "总先天一万六", materials: "经验三十五亿 精神五千万 劫灰66" },
    ],
    reincarnation: [
      { turn: "一转", experience: "1250万", sectLevel: 500, martialLevel: 400, wisdom: "15万" },
      { turn: "二转", experience: "1663万", sectLevel: 550, martialLevel: 420, wisdom: "15万" },
      { turn: "三转", experience: "2160万", sectLevel: 600, martialLevel: 440, wisdom: "15万" },
      { turn: "四转", experience: "2746万", sectLevel: 650, martialLevel: 460, wisdom: "15万" },
      { turn: "五转", experience: "3430万", sectLevel: 700, martialLevel: 480, wisdom: "15万" },
      { turn: "六转", experience: "4218万", sectLevel: 750, martialLevel: 500, wisdom: "15万" },
      { turn: "七转", experience: "5120万", sectLevel: 800, martialLevel: 520, wisdom: "15万" },
      { turn: "八转", experience: "6141万", sectLevel: 850, martialLevel: 540, wisdom: "15万" },
      { turn: "九转", experience: "7290万", sectLevel: 900, martialLevel: 560, wisdom: "15万" },
    ],
    supremeShatter: [
      { name: "至尊", innate: 300, yinyang: 1000 },
      { name: "神临", innate: 500, yinyang: 1200 },
      { name: "主宰", innate: 700, yinyang: 1500 },
      { name: "超脱", innate: 1000, yinyang: 1800 },
      { name: "无我", innate: 1200, yinyang: 2000 },
      { name: "逍遥", innate: 1500, yinyang: 2100 },
      { name: "混元", innate: 1800, yinyang: 2200 },
      { name: "鸿蒙", innate: 2000, yinyang: 2300 },
      { name: "不朽", innate: 2500, yinyang: 2500 },
    ],
  }

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto space-y-4 pb-28">
        <Tabs defaultValue="breakthrough" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="breakthrough">挣脱要求</TabsTrigger>
            <TabsTrigger value="reincarnation">转世要求</TabsTrigger>
            <TabsTrigger value="supreme">至尊破碎</TabsTrigger>
          </TabsList>

          <TabsContent value="breakthrough" className="space-y-3">
            <Card className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
              <CardHeader>
                <CardTitle className={`${theme === "dark" ? "text-white" : "text-gray-800"} text-sm`}>挣脱要求表</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tables.breakthrough.map((item, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-start mb-1">
                        <Badge variant="outline" className="text-xs">
                          {item.stage}
                        </Badge>
                        <span className="text-xs text-gray-600">{item.requirement}</span>
                      </div>
                      <div className="text-xs text-gray-700">{item.materials}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reincarnation" className="space-y-3">
            <Card className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
              <CardHeader>
                <CardTitle className={`${theme === "dark" ? "text-white" : "text-gray-800"} text-sm`}>转世要求表</CardTitle>
                <p className="text-xs text-gray-600">
                  注意：宗武+50等级，武修+20等级要求。转世后宗武全无，特殊技能、基础技能会掉等级273，武修等级也会掉。
                </p>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tables.reincarnation.map((item, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-center mb-2">
                        <Badge variant="outline" className="text-xs">
                          {item.turn}
                        </Badge>
                        <span className="text-xs font-medium text-blue-600">{item.experience}</span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-xs text-gray-600">
                        <div>宗武: {item.sectLevel}</div>
                        <div>武修: {item.martialLevel}</div>
                        <div>灵慧: {item.wisdom}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="supreme" className="space-y-3">
            <Card className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
              <CardHeader>
                <CardTitle className={`${theme === "dark" ? "text-white" : "text-gray-800"} text-sm`}>至尊破碎九段要求</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {tables.supremeShatter.map((item, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-gray-50">
                      <div className="flex justify-between items-center">
                        <Badge variant="outline" className="text-xs">
                          {item.name}
                        </Badge>
                        <div className="text-xs text-gray-600">
                          先天: {item.innate} | 阴阳十二天: {item.yinyang}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

// 礼包页面组件
function GiftsPage({ theme = "dark" }: { theme?: "light" | "dark" }) {
  const [searchTerm, setSearchTerm] = useState("")
  const [priceFilter, setPriceFilter] = useState("all")
  const [limitedFilter, setLimitedFilter] = useState("all")
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false) // 新增：只显示收藏
  const [favorites, setFavorites] = useState<string[]>([])
  const [giftPackages, setGiftPackages] = useState<
    Array<{
      name: string
      price: number
      isLimited: boolean
      contents: string
      purchaseLimit: number
      category: string
    }>
  >([])
  const [loading, setLoading] = useState(true)

  // 从本地存储加载收藏
  useEffect(() => {
    const savedFavorites = localStorage.getItem("gift-favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // 加载礼包数据
  useEffect(() => {
    const loadGiftPackages = async () => {
      try {
        const response = await fetch("/gift_packages.txt")
        const text = await response.text()

        const packages: Array<{
          name: string
          price: number
          isLimited: boolean
          contents: string
          purchaseLimit: number
          category: string
        }> = []

        // 解析礼包数据
        const sections = text.split("【").filter((section) => section.trim())

        sections.forEach((section) => {
          const lines = section.split("\n").filter((line) => line.trim())
          if (lines.length === 0) return

          // 提取价格
          const priceMatch = lines[0].match(/(\d+)赞助礼包】/)
          if (!priceMatch) return
          const price = Number.parseInt(priceMatch[1])

          let isLimited = false
          let currentCategory = ""

          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim()
            
            // 检查类别
            if (line === "2. 限定礼包：" || line === "1. 限定礼包：") {
              isLimited = true
              currentCategory = "限定礼包"
              continue
            } else if (line === "1. 非限定礼包：") {
              isLimited = false
              currentCategory = "非限定礼包"
              continue
            }

            // 处理礼包信息
            if (line.startsWith("- ")) {
              const packageMatch = line.match(/^- ([^：]+)：(.+) \(限购(\d+)次\)/)
              if (packageMatch) {
                packages.push({
                  name: packageMatch[1],
                  price: price,
                  isLimited: isLimited,
                  contents: packageMatch[2],
                  purchaseLimit: Number.parseInt(packageMatch[3]),
                  category: currentCategory,
                })
              }
            }
          }
        })

        console.log("Parsed packages:", packages)
        setGiftPackages(packages)
      } catch (error) {
        console.error("Failed to load gift packages:", error)
      } finally {
        setLoading(false)
      }
    }
    loadGiftPackages()
  }, [])

  // 保存收藏到本地存储
  const toggleFavorite = (giftName: string) => {
    const newFavorites = favorites.includes(giftName)
      ? favorites.filter((name) => name !== giftName)
      : [...favorites, giftName]

    setFavorites(newFavorites)
    localStorage.setItem("gift-favorites", JSON.stringify(newFavorites))
  }

  const filteredGifts = useMemo(() => {
    let filtered = giftPackages

    // 首先应用"只显示收藏"筛选
    if (showFavoritesOnly) {
      filtered = filtered.filter(gift => favorites.includes(gift.name))
    }

    // 应用搜索筛选
    if (searchTerm) {
      filtered = filtered.filter(
        (gift) =>
          gift.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          gift.contents.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // 应用价格筛选
    if (priceFilter && priceFilter !== "all") {
      filtered = filtered.filter((gift) => gift.price.toString() === priceFilter)
    }

    // 应用限定状态筛选
    if (limitedFilter && limitedFilter !== "all") {
      const isLimited = limitedFilter === "limited"
      filtered = filtered.filter((gift) => gift.isLimited === isLimited)
    }

    return filtered
  }, [searchTerm, priceFilter, limitedFilter, giftPackages, favorites, showFavoritesOnly])

  const priceOptions = [...new Set(giftPackages.map((gift) => gift.price))].sort((a, b) => a - b)

  if (loading) {
    return (
      <div className="p-4">
        <div className="max-w-md mx-auto pb-28">
          <Card className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
            <CardContent className="pt-6 text-center">
              <div className="animate-spin w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full mx-auto mb-2"></div>
              <p className={`${theme === "dark" ? "text-gray-500" : "text-gray-500"}`}>加载礼包数据中...</p>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto space-y-4 pb-28">
        {/* 搜索框 */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="搜索礼包..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`pl-10 ${theme === "dark" ? "bg-gray-800 border-gray-700 text-white" : "bg-white border-gray-200 text-gray-800"}`}
          />
        </div>

        {/* 提示信息 */}
        <Card className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
          <CardContent className="pt-6">
            <div className="flex items-start gap-2">
              <Info className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm text-gray-600">
                <p className="mb-1">截止三周年，所有礼包限购次数 × 4</p>
                <p>满月礼包分为两种：</p>
                <ul className="list-disc list-inside pl-4 space-y-1">
                  <li>满月限定礼包（每个价位都有）</li>
                  <li>满月系列礼包（188赞助，按月份区分）</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 筛选器 */}
        <div className="flex gap-2 flex-wrap">
          <Select value={priceFilter} onValueChange={setPriceFilter}>
            <SelectTrigger className="flex-1 min-w-[120px]">
              <SelectValue placeholder="赞助金额" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部金额</SelectItem>
              {priceOptions.map((price) => (
                <SelectItem key={price} value={price.toString()}>
                  {price}赞助
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={limitedFilter} onValueChange={setLimitedFilter}>
            <SelectTrigger className="flex-1 min-w-[120px]">
              <SelectValue placeholder="限定状态" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="limited">限定</SelectItem>
              <SelectItem value="unlimited">非限定</SelectItem>
            </SelectContent>
          </Select>
          
          {/* 收藏筛选开关 */}
          <Button 
            variant={showFavoritesOnly ? "default" : "outline"}
            size="sm" 
            onClick={() => setShowFavoritesOnly(!showFavoritesOnly)}
            className="flex-1 min-w-[120px]"
          >
            {showFavoritesOnly ? (
              <>
                <Star className="w-4 h-4 mr-2 fill-current" /> 收藏礼包
              </>
            ) : (
              <>
                <StarOff className="w-4 h-4 mr-2" /> 全部礼包
              </>
            )}
          </Button>
        </div>

        {/* 统计信息 */}
        <Card className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
          <CardContent className="pt-6">
            <div className="flex justify-between items-center">
              <div className="text-center">
                <div className="text-xl font-bold text-blue-600">{filteredGifts.length}</div>
                <div className="text-xs text-gray-600">礼包总数</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-red-600">
                  {filteredGifts.filter((g) => g.isLimited).length}
                </div>
                <div className="text-xs text-gray-600">限定礼包</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-bold text-green-600">{favorites.length}</div>
                <div className="text-xs text-gray-600">收藏数量</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 礼包列表 */}
        <div className="space-y-3">
          {filteredGifts.map((gift, index) => (
            <Card key={index} className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
              <CardContent className="pt-4">
                <div className="space-y-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-medium text-sm">{gift.name}</h3>
                        {gift.isLimited && (
                          <Badge variant="destructive" className="text-xs">
                            限定
                          </Badge>
                        )}
                        <Badge variant="outline" className="text-xs">
                          {gift.price}赞助
                        </Badge>
                      </div>
                      <div className="text-xs text-gray-600 mb-2">
                        {gift.category} • 限购{gift.purchaseLimit}次 (×4)
                      </div>
                    </div>
                    <Button size="sm" variant="ghost" onClick={() => toggleFavorite(gift.name)} className="h-8 w-8 p-0">
                      {favorites.includes(gift.name) ? (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      ) : (
                        <StarOff className="w-4 h-4 text-gray-400" />
                      )}
                    </Button>
                  </div>
                  <div className="text-xs text-gray-700 bg-gray-50 p-2 rounded whitespace-pre-wrap">{gift.contents}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredGifts.length === 0 && (
          <Card className={`${theme === "dark" ? "bg-black/30 backdrop-blur-md border-white/10 shadow-lg" : "bg-white border-gray-200 shadow"}`}>
            <CardContent className="pt-6 text-center text-gray-500">
              <Gift className="w-8 h-8 mx-auto mb-2 opacity-50" />
              <p>未找到相关礼包</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}


// 主应用组件
export default function MengjianghuAssistant() {
  const [activeTab, setActiveTab] = useState("commands")
  const [currentQuote, setCurrentQuote] = useState(inspirationalQuotes[0])
  const [theme, setTheme] = useState<"light" | "dark">("dark")

  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * inspirationalQuotes.length)
    setCurrentQuote(inspirationalQuotes[randomIndex])
  }, [])

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === "light" ? "dark" : "light")
  }

  const renderContent = () => {
    switch (activeTab) {
      case "commands":
        return <CommandsPage theme={theme} />
      case "dreamland":
        return <DreamlandPage theme={theme} />
      case "questions":
        return <QuestionsPage theme={theme} />
      case "common":
        return <CommonPage theme={theme} />
      case "gifts":
        return <GiftsPage theme={theme} />
      default:
        return <CommandsPage theme={theme} />
    }
  }

  return (
    <div className={`min-h-screen flex flex-col ${
      theme === "dark" 
        ? "bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900" 
        : "bg-gradient-to-br from-blue-50 via-white to-blue-50"
    }`}>
      {/* 添加顶部安全区域 */}
      <div className={`h-[env(safe-area-inset-top)] ${
        theme === "dark" ? "bg-gradient-to-r from-gray-900 to-gray-800" : "bg-white"
      }`}></div>
      
      <div className={`${
        theme === "dark" 
          ? "bg-black/20 backdrop-blur-md border-b border-white/10" 
          : "bg-white/80 backdrop-blur-md border-b border-gray-200 shadow-sm"
        } px-4 py-3 sticky top-[env(safe-area-inset-top)] z-50`}
      >
        <div className="max-w-md mx-auto flex items-center justify-between">
          <div className="flex-1">
            <h1 className={`text-lg font-bold text-center ${theme === "dark" ? "text-white" : "text-gray-800"} mb-1`}>梦江湖助手</h1>
            <div className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-500"} text-center mb-2`}>2025年7月</div>
            <div className="text-center">
              <div className={`text-xs ${theme === "dark" ? "text-gray-300" : "text-gray-500"} flex items-center justify-center gap-1`}>
                <Quote className={`w-3 h-3 ${theme === "dark" ? "text-blue-400" : "text-blue-600"}`} />
                <span className="italic">{currentQuote}</span>
              </div>
            </div>
          </div>
          <Button 
            onClick={toggleTheme} 
            size="icon" 
            variant="ghost" 
            className={`h-10 w-10 rounded-full absolute right-4 top-3 ${
              theme === "dark" ? "text-yellow-200 hover:text-yellow-100 hover:bg-gray-800" : "text-blue-600 hover:bg-blue-100"
            }`}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <div className="flex-1 overflow-auto">
        {renderContent()}
      </div>

      <BottomNavigation activeTab={activeTab} setActiveTab={setActiveTab} theme={theme} />
    </div>
  )
}
