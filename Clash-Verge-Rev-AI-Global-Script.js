function main(config) {

  // ==================================================
  // Clash Verge Rev - AI 独立分流
  //
  // 🤖 ChatGPT
  // 💎 Gemini
  // 🟠 Claude
  // 🧠 AI Other
  //
  // AI 节点显示：
  // 🇺🇸 美国
  // 🇯🇵 日本
  // 🇸🇬 新加坡
  // 🇹🇼 台湾
  // ==================================================

  // ==================================================
  // 1. AI 远程托管规则
  // ==================================================

  config["rule-providers"] = config["rule-providers"] || {};

  config["rule-providers"]["AI-OpenAI"] = {
    type: "http",
    behavior: "classical",
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/OpenAI/OpenAI.yaml",
    path: "./ruleset/ai/OpenAI.yaml",
    interval: 86400
  };

  config["rule-providers"]["AI-Gemini"] = {
    type: "http",
    behavior: "classical",
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Gemini/Gemini.yaml",
    path: "./ruleset/ai/Gemini.yaml",
    interval: 86400
  };

  config["rule-providers"]["AI-Claude"] = {
    type: "http",
    behavior: "classical",
    url: "https://cdn.jsdelivr.net/gh/blackmatrix7/ios_rule_script@master/rule/Clash/Claude/Claude.yaml",
    path: "./ruleset/ai/Claude.yaml",
    interval: 86400
  };

  // ==================================================
  // 2. 读取现有策略组
  // ==================================================

  config["proxy-groups"] = config["proxy-groups"] || [];

  const aiGroupNames = [
    "🤖 ChatGPT",
    "💎 Gemini",
    "🟠 Claude",
    "🧠 AI Other"
  ];

  config["proxy-groups"] = config["proxy-groups"].filter(
    group => !aiGroupNames.includes(group.name)
  );

  // ==================================================
  // 3. 迁移机场原来的 OpenAi
  // ==================================================

  const OLD_OPENAI_GROUP = "🤖 OpenAi";
  const NEW_OPENAI_GROUP = "🤖 ChatGPT";

  for (const group of config["proxy-groups"]) {
    if (Array.isArray(group.proxies)) {
      group.proxies = group.proxies.map(proxy =>
        proxy === OLD_OPENAI_GROUP
          ? NEW_OPENAI_GROUP
          : proxy
      );
    }
  }

  config["proxy-groups"] = config["proxy-groups"].filter(
    group => group.name !== OLD_OPENAI_GROUP
  );

  // ==================================================
  // 4. AI 节点过滤
  // 美国 / 日本 / 新加坡 / 台湾
  // ==================================================

  const aiNodeFilter =
    "(?i)(" +
    "🇺🇸|" +
    "美国|" +
    "美國|" +
    "United States|" +
    "USA|" +
    "\\bUS[0-9]*\\b|" +

    "🇯🇵|" +
    "日本|" +
    "Japan|" +
    "JPN|" +
    "东京|" +
    "東京|" +
    "大阪|" +
    "\\bJP[0-9]*\\b|" +

    "🇸🇬|" +
    "新加坡|" +
    "狮城|" +
    "獅城|" +
    "Singapore|" +
    "\\bSG[0-9]*\\b|" +

    "🇹🇼|" +
    "台湾|" +
    "台灣|" +
    "臺灣|" +
    "Taiwan|" +
    "台北|" +
    "臺北|" +
    "高雄|" +
    "\\bTW[0-9]*\\b" +
    ")";

  // ==================================================
  // 5. 创建 AI 策略组
  // ==================================================

  const aiGroups = [
    {
      name: "🤖 ChatGPT",
      type: "select",
      "include-all": true,
      filter: aiNodeFilter
    },
    {
      name: "💎 Gemini",
      type: "select",
      "include-all": true,
      filter: aiNodeFilter
    },
    {
      name: "🟠 Claude",
      type: "select",
      "include-all": true,
      filter: aiNodeFilter
    },
    {
      name: "🧠 AI Other",
      type: "select",
      "include-all": true,
      filter: aiNodeFilter
    }
  ];

  config["proxy-groups"] =
    aiGroups.concat(config["proxy-groups"]);

  // ==================================================
  // 6. AI 分流规则
  // ==================================================

  const aiRules = [
    // ChatGPT / OpenAI
    "DOMAIN-SUFFIX,chatgpt.com,🤖 ChatGPT",
    "DOMAIN-SUFFIX,openai.com,🤖 ChatGPT",
    "DOMAIN-SUFFIX,oaistatic.com,🤖 ChatGPT",
    "DOMAIN-SUFFIX,oaiusercontent.com,🤖 ChatGPT",
    "DOMAIN-SUFFIX,sora.com,🤖 ChatGPT",
    "RULE-SET,AI-OpenAI,🤖 ChatGPT",

    // Gemini
    "DOMAIN,gemini.google.com,💎 Gemini",
    "DOMAIN,aistudio.google.com,💎 Gemini",
    "DOMAIN,generativelanguage.googleapis.com,💎 Gemini",
    "DOMAIN,robinfrontend-pa.googleapis.com,💎 Gemini",
    "DOMAIN-SUFFIX,geller-pa.googleapis.com,💎 Gemini",
    "DOMAIN,alkalicore-pa.clients6.google.com,💎 Gemini",
    "DOMAIN,cloudcode-pa.googleapis.com,💎 Gemini",
    "RULE-SET,AI-Gemini,💎 Gemini",

    // Claude
    "DOMAIN-SUFFIX,claude.ai,🟠 Claude",
    "DOMAIN-SUFFIX,claude.com,🟠 Claude",
    "DOMAIN-SUFFIX,anthropic.com,🟠 Claude",
    "RULE-SET,AI-Claude,🟠 Claude",

    // Grok / xAI
    "DOMAIN-SUFFIX,grok.com,🧠 AI Other",
    "DOMAIN-SUFFIX,x.ai,🧠 AI Other",

    // Perplexity
    "DOMAIN-SUFFIX,perplexity.ai,🧠 AI Other",
    "DOMAIN-SUFFIX,pplx.ai,🧠 AI Other",

    // Cursor
    "DOMAIN-SUFFIX,cursor.com,🧠 AI Other",
    "DOMAIN-SUFFIX,cursor.sh,🧠 AI Other",

    // Microsoft / GitHub Copilot
    "DOMAIN,copilot.microsoft.com,🧠 AI Other",
    "DOMAIN-SUFFIX,githubcopilot.com,🧠 AI Other"
  ];

  // ==================================================
  // 7. 机场原有规则
  // ==================================================

  let oldRules = config["rules"] || [];

  // ==================================================
  // 8. 旧 OpenAi 规则迁移
  // ==================================================

  oldRules = oldRules.map(rule => {
    if (typeof rule !== "string") {
      return rule;
    }

    return rule.replace(
      /,🤖 OpenAi(?=,|$)/g,
      ",🤖 ChatGPT"
    );
  });

  // ==================================================
  // 9. AI 规则置顶
  // ==================================================

  config["rules"] =
    aiRules.concat(oldRules);

  return config;
}
