import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, HelpCircle, X, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

interface ClassOption {
  number: string;
  title: string;
  description: string;
  category: "goods" | "services";
  icon: string;
  examples: string[];
}

const classOptions: ClassOption[] = [
  {
    number: "25",
    title: "Clothing",
    description: "Clothing, footwear, headgear",
    category: "goods",
    icon: "👕",
    examples: ["T-shirts", "Shoes", "Hats", "Dresses"]
  },
  {
    number: "9",
    title: "Electronics",
    description: "Scientific, nautical, surveying, photographic, cinematographic, optical, weighing, measuring, signaling, checking (supervision), life-saving and teaching apparatus and instruments",
    category: "goods",
    icon: "💻",
    examples: ["Software", "Computers", "Mobile phones", "Smart devices"]
  },
  {
    number: "35",
    title: "Advertising & Business",
    description: "Advertising; business management; business administration; office functions",
    category: "services",
    icon: "📊",
    examples: ["Marketing services", "Business consultancy", "Retail services"]
  },
  // Add more classes as needed
];

interface ClassSelectorProps {
  selectedClasses: string[];
  onChange: (classes: string[]) => void;
}

const ClassSelector = ({ selectedClasses, onChange }: ClassSelectorProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  const [showExplorer, setShowExplorer] = useState(false);
  const [activeTab, setActiveTab] = useState<"goods" | "services">("goods");

  const filteredClasses = classOptions.filter(option => {
    const matchesSearch = option.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         option.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         option.number.includes(searchQuery);
    const matchesCategory = option.category === activeTab;
    return matchesSearch && matchesCategory;
  });

  const handleClassSelect = (classNumber: string) => {
    if (selectedClasses.includes(classNumber)) {
      onChange(selectedClasses.filter(c => c !== classNumber));
    } else {
      onChange([...selectedClasses, classNumber]);
    }
  };

  const removeClass = (classNumber: string) => {
    onChange(selectedClasses.filter(c => c !== classNumber));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {selectedClasses.map(classNumber => {
          const classInfo = classOptions.find(opt => opt.number === classNumber);
          return (
            <Badge
              key={classNumber}
              variant="secondary"
              className="flex items-center gap-1"
            >
              <span className={classInfo?.category === "goods" ? "text-blue-500" : "text-green-500"}>
                {classInfo?.icon}
              </span>
              [{classNumber}] {classInfo?.title}
              <button
                onClick={() => removeClass(classNumber)}
                className="ml-1 hover:text-red-500"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          );
        })}
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search classes (e.g., clothing, software, education)"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "goods" | "services")}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="goods">Goods (1-34)</TabsTrigger>
          <TabsTrigger value="services">Services (35-45)</TabsTrigger>
        </TabsList>
        <TabsContent value="goods">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-4">
              {filteredClasses.map(option => (
                <div
                  key={option.number}
                  className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                    selectedClasses.includes(option.number) ? "bg-blue-50 border-blue-200" : ""
                  }`}
                  onClick={() => handleClassSelect(option.number)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <div className="font-medium">
                          [{option.number}] {option.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {option.description}
                        </div>
                      </div>
                    </div>
                    {selectedClasses.includes(option.number) && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Examples: {option.examples.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
        <TabsContent value="services">
          <ScrollArea className="h-[300px] rounded-md border p-4">
            <div className="space-y-4">
              {filteredClasses.map(option => (
                <div
                  key={option.number}
                  className={`p-4 rounded-lg border cursor-pointer hover:bg-gray-50 ${
                    selectedClasses.includes(option.number) ? "bg-green-50 border-green-200" : ""
                  }`}
                  onClick={() => handleClassSelect(option.number)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-2xl">{option.icon}</span>
                      <div>
                        <div className="font-medium">
                          [{option.number}] {option.title}
                        </div>
                        <div className="text-sm text-gray-500">
                          {option.description}
                        </div>
                      </div>
                    </div>
                    {selectedClasses.includes(option.number) && (
                      <Check className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <div className="mt-2 text-sm text-gray-500">
                    Examples: {option.examples.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>

      <Dialog open={showExplorer} onOpenChange={setShowExplorer}>
        <DialogTrigger asChild>
          <Button variant="outline" className="w-full">
            <HelpCircle className="h-4 w-4 mr-2" />
            Need help choosing a class?
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-2xl">
          <div className="space-y-6">
            <h3 className="text-lg font-medium">Class Explorer</h3>
            <p className="text-sm text-gray-500">
              Answer a few questions to help us suggest the right class for your trademark.
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Are you selling a product or a service?
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <Button
                    variant={activeTab === "goods" ? "default" : "outline"}
                    onClick={() => setActiveTab("goods")}
                  >
                    Product
                  </Button>
                  <Button
                    variant={activeTab === "services" ? "default" : "outline"}
                    onClick={() => setActiveTab("services")}
                  >
                    Service
                  </Button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  Describe your business in one line
                </label>
                <Input
                  placeholder="e.g., We sell handmade clothing online"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <div className="pt-4">
                <h4 className="text-sm font-medium mb-2">Suggested Classes</h4>
                <div className="space-y-2">
                  {filteredClasses.slice(0, 3).map(option => (
                    <div
                      key={option.number}
                      className="p-3 rounded-lg border cursor-pointer hover:bg-gray-50"
                      onClick={() => {
                        handleClassSelect(option.number);
                        setShowExplorer(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{option.icon}</span>
                        <div>
                          <div className="font-medium">
                            [{option.number}] {option.title}
                          </div>
                          <div className="text-sm text-gray-500">
                            {option.description}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ClassSelector; 