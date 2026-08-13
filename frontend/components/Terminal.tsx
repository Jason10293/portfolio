import React, { useState, useRef, useEffect } from "react";
import { ChatMessage } from "../types";

const CAT_ASCII_AWAKE = `
  /\\_/\\  (
 ( ^.^ ) _)
   \\"/\  (
 ( | | )
(__d b__)
`;

const CAT_ASCII_ASLEEP = `
      |\\      _,,,---,,_
ZZZzz /, \`.-'\`'    -.  ;-;;,_
     |,4-  ) )-,_. ,\\ (  \`'-'
    '---''(_/--'  \`-'\\_)
`;

const COMMANDS: Record<string, string> = {
  help: "Available commands: help, clear, ls, whoami, projects, contact, sudo",
  ls: "index.tsx    secret_cat_pics/",
  whoami: "User: guest@portfolio\nRole: Visitor\nAccess: Read-only",
  contact:
    "Email: jason.wu@queensu.ca\nGitHub: github.com/Jason10293\nLinkedIn: linkedin.com/in/29jason-wu",
  projects:
    "1. Cubing Coach\n2. Budget Agent\n3. Cloud Code Snippet Sharing Platform\n4. Pokemon Higher Lower\n5. Go Backend API\n6. Redis Clone",
  sudo: 'Permission denied: User is not in the sudoers file. Try "meow".',
};

const SECRET_CAT_IMAGES = [
  "https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1533738363-b7f9aef128ce?w=400&h=400&fit=crop",
  "https://images.unsplash.com/photo-1573865526739-10659fec78a5?w=400&h=400&fit=crop",
];

const DEFAULT_RESPONSES = [
  "System note: network access disabled. Here for the vibes only.",
  "Local build active. Try the built-in commands or ask about projects.",
  "Offline assistant: Focus mode engaged, no AI daemons running.",
  "Portfolio core systems nominal. External AI connectors removed for safety.",
];

const getFallbackResponse = (input: string) => {
  if (input.includes("project")) {
    return "Projects online: Cubing Coach, Budget Agent, Cloud Code Snippets, Pokemon Higher Lower, Go Backend API, and Redis Clone.";
  }
  if (input.includes("contact")) {
    return "Contact options: Github, LinkedIn, or Email via the hero section.";
  }
  if (input.includes("music")) {
    return "Music telemetry is mocked locally. Check the Music tab for details.";
  }
  const randomIndex = Math.floor(Math.random() * DEFAULT_RESPONSES.length);
  return DEFAULT_RESPONSES[randomIndex];
};

const Terminal: React.FC = () => {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "init",
      role: "model",
      text: 'Type "help" to view commands (try cat).',
      timestamp: new Date(),
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof document === "undefined") return false;
    return document.documentElement.classList.contains("dark");
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const syncThemeFromDom = () => {
      if (typeof document === "undefined") return;
      setIsDarkMode(document.documentElement.classList.contains("dark"));
    };

    const handleThemeChange = (event: Event) => {
      const detail = (event as CustomEvent<{ theme?: string }>).detail;
      if (detail?.theme) {
        setIsDarkMode(detail.theme === "dark");
      } else {
        syncThemeFromDom();
      }
    };

    syncThemeFromDom();
    window.addEventListener("themechange", handleThemeChange);
    return () => window.removeEventListener("themechange", handleThemeChange);
  }, []);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const rawInput = input.trim();
    const lowerInput = rawInput.toLowerCase();

    // Special Case: Clear
    if (lowerInput === "clear") {
      setMessages([
        {
          id: Date.now().toString(),
          role: "model",
          text: "Console cleared.",
          timestamp: new Date(),
        },
      ]);
      setInput("");
      return;
    }

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      text: rawInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput("");

    // 1. Check for Secret Cat Pics (Easter Egg)
    if (
      lowerInput.includes("secret_cat_pics") ||
      (lowerInput.includes("cd") && lowerInput.includes("cat")) ||
      lowerInput === "ls -a"
    ) {
      setIsLoading(true);
      // Simulate "decrypting" delay
      setTimeout(() => {
        setIsLoading(false);
        setMessages((prev) => [
          ...prev,
          {
            id: Date.now().toString(),
            role: "system",
            text: "Accessing encrypted partition... Verified.\nDisplaying contents of /secret_cat_pics:",
            timestamp: new Date(),
            imageUrls: SECRET_CAT_IMAGES,
          },
        ]);
      }, 800);
      return;
    }

    // 2. Check Hardcoded Commands
    if (lowerInput in COMMANDS) {
      const responseText = COMMANDS[lowerInput];
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: responseText,
        timestamp: new Date(),
      };
      setTimeout(() => {
        setMessages((prev) => [...prev, botMsg]);
      }, 100);
      return;
    }

    // 3. ASCII Cat
    if (["cat", "meow", "pspsps", "kitten"].includes(lowerInput)) {
      const art = isDarkMode ? CAT_ASCII_ASLEEP : CAT_ASCII_AWAKE;
      const catMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "system",
        text: art,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, catMsg]);
      return;
    }

    // 4. Local fallback responses
    setIsLoading(true);
    const responseText = getFallbackResponse(lowerInput);
    setTimeout(() => {
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: "model",
        text: responseText,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsLoading(false);
    }, 300);
  };

  const systemColor = "text-neutral-400 dark:text-neutral-500";
  const userColor = "text-neutral-900 dark:text-neutral-100";
  const modelColor = "text-neutral-600 dark:text-neutral-300";

  return (
    <div className="w-full font-mono text-sm leading-relaxed">
      <div
        ref={scrollRef}
        className="max-h-96 overflow-y-auto mb-2 space-y-4 no-scrollbar"
      >
        {messages.map((msg) => (
          <div key={msg.id} className="break-words">
            <div className="flex gap-2">
              <span className={`shrink-0 ${systemColor} select-none`}>
                {msg.role === "user" ? "➜" : ""}
              </span>

              {msg.text === CAT_ASCII_AWAKE ? (
                <pre
                  className={`font-mono text-xs leading-none whitespace-pre overflow-hidden max-w-full ${modelColor}`}
                >
                  {msg.text}
                </pre>
              ) : (
                <span
                  className={`${
                    msg.role === "user" ? userColor : modelColor
                  } whitespace-pre-wrap`}
                >
                  {msg.text}
                </span>
              )}
            </div>

            {/* Render Images if present */}
            {msg.imageUrls && (
              <div className="grid grid-cols-3 gap-2 mt-3 pl-5">
                {msg.imageUrls.map((url, idx) => (
                  <div
                    key={idx}
                    className="aspect-square bg-neutral-100 dark:bg-neutral-800 overflow-hidden relative group"
                  >
                    <img
                      src={url}
                      alt="Secret Cat"
                      className="object-cover w-full h-full grayscale hover:grayscale-0 transition-all duration-500"
                    />
                    <div className="absolute inset-0 ring-1 ring-inset ring-black/10"></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
        {isLoading && (
          <div>
            <span className={`mr-2 ${systemColor}`}></span>
            <span className="animate-pulse text-neutral-300 dark:text-neutral-600">
              ...
            </span>
          </div>
        )}
      </div>

      <form onSubmit={handleSend} className="flex gap-2 items-center mt-4">
        <span className={`${systemColor} select-none`}>➜</span>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className={`flex-1 bg-transparent border-none outline-none p-0 ${userColor} placeholder-neutral-300 dark:placeholder-neutral-500`}
          placeholder="Command..."
          autoComplete="off"
        />
      </form>
    </div>
  );
};

export default Terminal;
