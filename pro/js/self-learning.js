/**
 * SelfLearning Engine - Adaptive AI improvement through interaction tracking,
 * pattern discovery, insight generation, and personalized suggestions.
 */
const SelfLearning = (function () {
  'use strict';

  const STORAGE_KEY = 'hopeai_self_learning';
  const MAX_HISTORY = 200;
  const INSIGHT_THRESHOLD = 5;
  const PATTERN_MIN_OCCURRENCES = 3;

  // ─── Internal State ────────────────────────────────────────────────

  let interactionLog = [];
  let evolutionTimeline = [];
  let insightBank = [];
  let discoveredPatterns = [];

  let state = {
    sessions: 0,
    interactions: 0,
    insightsGenerated: 0,
    patternsDiscovered: 0,
    lastLearningTime: null,
    learningRate: 0,
    topSkills: []
  };

  // ─── Utilities ─────────────────────────────────────────────────────

  function generateId() {
    return Date.now().toString(36) + Math.random().toString(36).slice(2, 9);
  }

  function nowISO() {
    return new Date().toISOString();
  }

  function extractKeywords(text) {
    if (!text) return [];
    const tokens = text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(t => t.length > 2);
    const stopWords = new Set([
      'the', 'and', 'for', 'that', 'this', 'with', 'you', 'are', 'was',
      'can', 'not', 'but', 'have', 'has', 'from', 'will', 'what', 'how',
      'when', 'where', 'which', 'who', 'whom', 'all', 'any', 'did', 'does',
      'each', 'few', 'just', 'more', 'most', 'other', 'some', 'such', 'than',
      'then', 'very', 'about', 'after', 'been', 'being', 'into', 'over',
      'said', 'they', 'were', 'would', 'your', 'here', 'there', 'their',
      'also', 'only', 'like', 'make', 'need', 'much', 'well', 'back', 'get',
      'its', 'our', 'out', 'use', 'using', 'should', 'could', 'might', 'now',
      'between', 'through', 'above', 'below', 'under', 'again', 'further',
      'once', 'already', 'before', 'afterwards', 'therefore', 'because'
    ]);
    return tokens.filter(t => !stopWords.has(t));
  }

  function similarityScore(a, b) {
    const setA = new Set(extractKeywords(a));
    const setB = new Set(extractKeywords(b));
    if (setA.size === 0 || setB.size === 0) return 0;
    let intersection = 0;
    for (const w of setA) { if (setB.has(w)) intersection++; }
    return intersection / Math.min(setA.size, setB.size);
  }

  function getHourBucket(isoString) {
    const h = new Date(isoString).getHours();
    if (h < 6) return 'night';
    if (h < 12) return 'morning';
    if (h < 18) return 'afternoon';
    return 'evening';
  }

  // ─── Persistence ───────────────────────────────────────────────────

  function persist() {
    try {
      const payload = {
        state: { ...state },
        interactionLog: interactionLog.slice(-MAX_HISTORY),
        evolutionTimeline: evolutionTimeline.slice(-MAX_HISTORY),
        insightBank: insightBank.slice(-50),
        discoveredPatterns: discoveredPatterns.slice(-50),
        version: 1
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
      return true;
    } catch (e) {
      return false;
    }
  }

  function restore() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (!raw) return false;
      const payload = JSON.parse(raw);
      if (!payload || payload.version !== 1) return false;
      state = { ...state, ...payload.state };
      interactionLog = payload.interactionLog || [];
      evolutionTimeline = payload.evolutionTimeline || [];
      insightBank = payload.insightBank || [];
      discoveredPatterns = payload.discoveredPatterns || [];
      return true;
    } catch (e) {
      return false;
    }
  }

  // ─── Timeline Events ───────────────────────────────────────────────

  function addTimelineEvent(type, detail) {
    const event = {
      id: generateId(),
      type: type,
      timestamp: nowISO(),
      detail: detail
    };
    evolutionTimeline.push(event);
  }

  // ─── Pattern Detection ─────────────────────────────────────────────

  function detectPatterns() {
    if (interactionLog.length < PATTERN_MIN_OCCURRENCES) return [];

    const patterns = [];

    // 1. Agent usage frequency
    const agentCounts = {};
    for (const entry of interactionLog) {
      const agent = entry.agentId || 'default';
      agentCounts[agent] = (agentCounts[agent] || 0) + 1;
    }
    const total = interactionLog.length;
    for (const [agent, count] of Object.entries(agentCounts)) {
      if (count >= PATTERN_MIN_OCCURRENCES) {
        const pct = Math.round((count / total) * 100);
        patterns.push({
          id: generateId(),
          category: 'agent_usage',
          label: agent + ' agent',
          description: 'Used in ' + count + ' interactions (' + pct + '% of total)',
          frequency: count,
          percentage: pct
        });
      }
    }

    // 2. Peak usage hours
    const buckets = { morning: 0, afternoon: 0, evening: 0, night: 0 };
    for (const entry of interactionLog) {
      const bucket = getHourBucket(entry.timestamp);
      buckets[bucket] = (buckets[bucket] || 0) + 1;
    }
    const peak = Object.entries(buckets).sort((a, b) => b[1] - a[1])[0];
    if (peak && peak[1] >= PATTERN_MIN_OCCURRENCES) {
      patterns.push({
        id: generateId(),
        category: 'peak_usage',
        label: 'Peak usage: ' + peak[0],
        description: 'Most active during ' + peak[0] + ' (' + peak[1] + ' interactions)',
        frequency: peak[1],
        percentage: Math.round((peak[1] / total) * 100)
      });
    }

    // 3. Topic clusters via keyword co-occurrence
    const keywordMap = {};
    for (const entry of interactionLog) {
      const kwds = extractKeywords(entry.query || '');
      for (const k of kwds) {
        keywordMap[k] = (keywordMap[k] || 0) + 1;
      }
    }
    const topKeywords = Object.entries(keywordMap)
      .filter(([, c]) => c >= PATTERN_MIN_OCCURRENCES)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    if (topKeywords.length > 0) {
      // Group related keywords
      const techGroups = {
        frontend: ['react', 'vue', 'angular', 'component', 'hook', 'state', 'css', 'html', 'dom', 'jsx'],
        backend: ['api', 'server', 'database', 'sql', 'express', 'node', 'endpoint', 'auth', 'rest'],
        devops: ['deploy', 'docker', 'ci', 'pipeline', 'kubernetes', 'build', 'test'],
        data: ['data', 'json', 'array', 'object', 'map', 'filter', 'reduce', 'sort'],
        architecture: ['pattern', 'design', 'architecture', 'module', 'class', 'interface']
      };

      const groupCounts = {};
      for (const [kw, count] of topKeywords) {
        for (const [group, words] of Object.entries(techGroups)) {
          if (words.includes(kw)) {
            groupCounts[group] = (groupCounts[group] || 0) + count;
          }
        }
      }

      for (const [group, count] of Object.entries(groupCounts)) {
        if (count >= PATTERN_MIN_OCCURRENCES * 2) {
          patterns.push({
            id: generateId(),
            category: 'topic_cluster',
            label: group + ' topics',
            description: 'Frequent ' + group + ' related queries (' + count + ' keyword matches)',
            frequency: count,
            percentage: 0
          });
        }
      }
    }

    // 4. Helpfulness trend
    const recentEntries = interactionLog.slice(-20);
    const helpfulCount = recentEntries.filter(e => e.wasHelpful === true).length;
    if (recentEntries.length >= 5) {
      const helpfulRate = Math.round((helpfulCount / recentEntries.length) * 100);
      let trend = 'stable';
      const olderHalf = interactionLog.slice(-40, -20);
      if (olderHalf.length >= 5) {
        const olderHelpful = olderHalf.filter(e => e.wasHelpful === true).length;
        const olderRate = Math.round((olderHelpful / olderHalf.length) * 100);
        if (helpfulRate > olderRate + 5) trend = 'improving';
        else if (helpfulRate < olderRate - 5) trend = 'declining';
      }
      patterns.push({
        id: generateId(),
        category: 'quality_trend',
        label: 'Helpfulness: ' + helpfulRate + '%',
        description: 'Recent response helpfulness rate, trend is ' + trend,
        frequency: helpfulCount,
        percentage: helpfulRate
      });
    }

    // Deduplicate
    const seen = new Set();
    const uniquePatterns = patterns.filter(p => {
      const key = p.category + '|' + p.label;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });

    return uniquePatterns;
  }

  // ─── Insight Generation ────────────────────────────────────────────

  function generateInsights() {
    if (interactionLog.length < INSIGHT_THRESHOLD) return [];

    const insights = [];
    const recent = interactionLog.slice(-30);
    const total = interactionLog.length;

    // 1. Topic-based insight
    const keywordCounts = {};
    for (const entry of recent) {
      for (const k of extractKeywords(entry.query || '')) {
        keywordCounts[k] = (keywordCounts[k] || 0) + 1;
      }
    }
    const topWords = Object.entries(keywordCounts)
      .filter(([, c]) => c >= INSIGHT_THRESHOLD)
      .sort((a, b) => b[1] - a[1]);

    if (topWords.length > 0) {
      const word = topWords[0][0];
      const count = topWords[0][1];
      insights.push({
        id: generateId(),
        type: 'topic_focus',
        title: 'Focus Area Detected',
        message: "You've been asking a lot about " + word + " (" + count + " recent queries). Would you like related patterns or best practices?",
        confidence: Math.min(count / INSIGHT_THRESHOLD, 1),
        relatedKeyword: word,
        generatedAt: nowISO()
      });
    }

    // 2. Session efficiency insight
    const helpfulRate = recent.filter(e => e.wasHelpful).length / Math.max(1, recent.length);
    if (recent.length >= 10) {
      if (helpfulRate > 0.8) {
        insights.push({
          id: generateId(),
          type: 'efficiency',
          title: 'High Response Quality',
          message: Math.round(helpfulRate * 100) + '% of recent responses were helpful — the interaction style is working well.',
          confidence: helpfulRate,
          generatedAt: nowISO()
        });
      } else if (helpfulRate < 0.4) {
        insights.push({
          id: generateId(),
          type: 'efficiency',
          title: 'Improvement Opportunity',
          message: 'Only ' + Math.round(helpfulRate * 100) + '% of recent responses were helpful. Consider being more specific in queries for better results.',
          confidence: 1 - helpfulRate,
          generatedAt: nowISO()
        });
      }
    }

    // 3. New knowledge area insight
    const firstHalf = interactionLog.slice(0, Math.floor(total / 2));
    const secondHalf = interactionLog.slice(Math.floor(total / 2));
    const firstKeywords = new Set();
    const secondKeywords = new Set();
    for (const e of firstHalf) { for (const k of extractKeywords(e.query)) { firstKeywords.add(k); } }
    for (const e of secondHalf) { for (const k of extractKeywords(e.query)) { secondKeywords.add(k); } }
    const newTopics = [...secondKeywords].filter(k => !firstKeywords.has(k));

    if (newTopics.length >= 3) {
      insights.push({
        id: generateId(),
        type: 'knowledge_expansion',
        title: 'Expanding Knowledge Scope',
        message: 'New topic areas have emerged recently: ' + newTopics.slice(0, 5).join(', ') + '. The learning scope is expanding.',
        confidence: Math.min(newTopics.length / 10, 1),
        discoveredTopics: newTopics.slice(0, 5),
        generatedAt: nowISO()
      });
    }

    // 4. Speed insight
    if (total >= 10) {
      const perSession = state.sessions > 0 ? (total / state.sessions).toFixed(1) : 0;
      if (perSession > 15) {
        insights.push({
          id: generateId(),
          type: 'productivity',
          title: 'High Session Activity',
          message: 'Averaging ' + perSession + ' interactions per session — you are making rapid progress.',
          confidence: 0.8,
          generatedAt: nowISO()
        });
      }
    }

    return insights;
  }

  // ─── Top Skills Computation ────────────────────────────────────────

  function computeTopSkills() {
    const skillMap = {};
    for (const entry of interactionLog) {
      const agent = entry.agentId || 'general';
      skillMap[agent] = (skillMap[agent] || 0) + 1;
    }
    const skills = Object.entries(skillMap)
      .filter(([, count]) => count >= PATTERN_MIN_OCCURRENCES)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([name, count]) => ({
        name: name,
        usageCount: count,
        rating: Math.min(count / interactionLog.length * 100, 100)
      }));
    return skills;
  }

  // ─── Suggestion Engine ─────────────────────────────────────────────

  function calculateSuggestionConfidence(skill, query) {
    const skillKeywords = extractKeywords(skill.name);
    const queryKeywords = extractKeywords(query);
    if (skillKeywords.length === 0 || queryKeywords.length === 0) return 0;
    let matches = 0;
    for (const qk of queryKeywords) {
      if (skillKeywords.some(sk => sk.includes(qk) || qk.includes(sk))) {
        matches++;
      }
    }
    return matches / Math.max(skillKeywords.length, 1);
  }

  // ─── Public API ────────────────────────────────────────────────────

  return {
    state: state,

    /**
     * Track a new interaction — called after each user-AI exchange.
     *
     * @param {string} agentId   - Identifier of the agent/tool involved
     * @param {string} query     - The user's query or intent
     * @param {string} response  - The AI response (may be truncated for storage)
     * @param {boolean} wasHelpful - Whether the user marked this as helpful
     */
    track(agentId, query, response, wasHelpful) {
      state.interactions++;

      const entry = {
        id: generateId(),
        timestamp: nowISO(),
        agentId: agentId || 'unknown',
        query: (query || '').slice(0, 500),
        responsePreview: (response || '').slice(0, 200),
        wasHelpful: !!wasHelpful,
        tokens: typeof query === 'string' ? Math.round(query.split(/\s+/).length * 1.3) : 0
      };

      interactionLog.push(entry);
      if (interactionLog.length > MAX_HISTORY) {
        interactionLog.shift();
      }

      state.lastLearningTime = nowISO();
      if (state.sessions > 0) {
        state.learningRate = parseFloat((state.interactions / state.sessions).toFixed(2));
      }

      state.topSkills = computeTopSkills();

      // Periodically run analysis (every 5 interactions)
      if (state.interactions % 5 === 0) {
        this.analyze();
      }

      persist();
      return entry;
    },

    /**
     * Analyze interaction history to discover patterns and generate insights.
     * @returns {{ patterns: Array, insights: Array }}
     */
    analyze() {
      const newPatterns = detectPatterns();
      const newInsights = generateInsights();

      // Merge new patterns (avoid duplicates)
      for (const p of newPatterns) {
        const exists = discoveredPatterns.some(dp => dp.label === p.label && dp.category === p.category);
        if (!exists) {
          discoveredPatterns.push(p);
          state.patternsDiscovered++;
          addTimelineEvent('pattern_discovered', p.label);
        }
      }

      // Merge new insights
      for (const ins of newInsights) {
        const exists = insightBank.some(ib => ib.type === ins.type && ib.title === ins.title);
        if (!exists) {
          insightBank.push(ins);
          state.insightsGenerated++;
          addTimelineEvent('insight_generated', ins.title);
        }
      }

      // Trim collections
      if (discoveredPatterns.length > 100) discoveredPatterns = discoveredPatterns.slice(-100);
      if (insightBank.length > 50) insightBank = insightBank.slice(-50);

      persist();

      return {
        patterns: newPatterns,
        insights: newInsights
      };
    },

    /**
     * @returns {object} Formatted learning statistics for UI display.
     */
    getStats() {
      const recent = interactionLog.slice(-20);
      const helpfulCount = recent.filter(e => e.wasHelpful).length;
      const helpfulRate = recent.length > 0
        ? Math.round((helpfulCount / recent.length) * 100)
        : 0;

      const hourlyDist = { morning: 0, afternoon: 0, evening: 0, night: 0 };
      for (const e of interactionLog) {
        hourlyDist[getHourBucket(e.timestamp)]++;
      }
      const peakHour = Object.entries(hourlyDist)
        .sort((a, b) => b[1] - a[1])[0] || ['evening', 0];

      const agents = {};
      for (const e of interactionLog) {
        agents[e.agentId] = (agents[e.agentId] || 0) + 1;
      }
      const favoriteAgent = Object.entries(agents)
        .sort((a, b) => b[1] - a[1])[0] || ['unknown', 0];

      return {
        totalSessions: state.sessions,
        totalInteractions: state.interactions,
        totalInsights: state.insightsGenerated,
        totalPatterns: state.patternsDiscovered,
        learningRate: state.learningRate,
        lastLearningTime: state.lastLearningTime,
        helpfulRate: helpfulRate,
        peakUsageTime: peakHour[0],
        peakUsageCount: peakHour[1],
        favoriteAgent: favoriteAgent[0],
        topSkills: state.topSkills,
        recentInsights: insightBank.slice(-5).reverse(),
        recentPatterns: discoveredPatterns.slice(-5).reverse(),
        memoryUsage: interactionLog.length + '/' + MAX_HISTORY + ' entries',
        interactionLog: interactionLog
      };
    },

    /**
     * Generate personalized suggestions based on the current query and interaction history.
     * @param {string} query - The user's current query
     * @returns {Array<{ skill: string, confidence: number, reason: string }>}
     */
    suggest(query) {
      if (!query || interactionLog.length < 3) return [];

      const suggestions = [];

      // Match against top skills
      for (const skill of state.topSkills) {
        const confidence = calculateSuggestionConfidence(skill, query);
        if (confidence > 0.1) {
          suggestions.push({
            skill: skill.name,
            confidence: parseFloat(confidence.toFixed(2)),
            reason: 'Based on ' + skill.usageCount + ' previous uses'
          });
        }
      }

      // Match against recent patterns
      const recentPatterns = discoveredPatterns.slice(-10);
      const queryLower = query.toLowerCase();
      for (const pattern of recentPatterns) {
        if (pattern.category === 'topic_cluster') {
          const groupKeywords = {
            frontend: ['html', 'css', 'js', 'component', 'ui', 'page', 'style', 'layout'],
            backend: ['api', 'server', 'database', 'sql', 'endpoint', 'auth'],
            devops: ['deploy', 'build', 'ci', 'docker', 'container', 'pipeline']
          };
          const keywords = groupKeywords[pattern.label.replace(' topics', '')] || [];
          if (keywords.some(k => queryLower.includes(k))) {
            suggestions.push({
              skill: pattern.label,
              confidence: parseFloat((pattern.frequency / interactionLog.length).toFixed(2)),
              reason: 'Frequent topic in your history'
            });
          }
        }
      }

      // Match against agent usage
      const recentAgent = interactionLog.slice(-3).map(e => e.agentId).find(Boolean);
      if (recentAgent && !suggestions.some(s => s.skill === recentAgent)) {
        suggestions.push({
          skill: recentAgent,
          confidence: 0.5,
          reason: 'Recently used agent'
        });
      }

      // Deduplicate and sort by confidence
      const seen = new Set();
      return suggestions
        .filter(s => { const dup = seen.has(s.skill); seen.add(s.skill); return !dup; })
        .sort((a, b) => b.confidence - a.confidence)
        .slice(0, 5);
    },

    /**
     * Persist current learning state to localStorage.
     * @returns {boolean}
     */
    save() {
      return persist();
    },

    /**
     * Restore learning state from localStorage. Also bumps session count.
     * @returns {boolean}
     */
    load() {
      const restored = restore();
      if (restored) {
        state.sessions++;
        addTimelineEvent('session_start', 'Session #' + state.sessions + ' started');
        if (state.interactions > 0) {
          state.learningRate = parseFloat((state.interactions / state.sessions).toFixed(2));
        }
        persist();
      } else {
        // First time — initialize session count
        state.sessions = 1;
        addTimelineEvent('session_start', 'First learning session started');
        persist();
      }
      return restored;
    },

    /**
     * @returns {Array} Chronological list of evolution timeline events.
     */
    getEvolutionTimeline() {
      return evolutionTimeline.slice().reverse();
    },

    /**
     * Generate a Markdown-formatted self-evolution report.
     * @returns {string}
     */
    generateReport() {
      const stats = this.getStats();
      const timeline = this.getEvolutionTimeline();
      const recentTimeline = timeline.slice(0, 20);

      const lines = [
        '# Self-Learning Engine Report',
        '',
        'Generated: ' + nowISO(),
        '',
        '## Overview',
        '',
        '| Metric | Value |',
        '|--------|-------|',
        '| Total Sessions | ' + stats.totalSessions + ' |',
        '| Total Interactions | ' + stats.totalInteractions + ' |',
        '| Insights Generated | ' + stats.totalInsights + ' |',
        '| Patterns Discovered | ' + stats.totalPatterns + ' |',
        '| Learning Rate | ' + stats.learningRate + ' interactions/session |',
        '| Helpful Response Rate | ' + stats.helpfulRate + '% |',
        '| Peak Usage Time | ' + stats.peakUsageTime + ' (' + stats.peakUsageCount + ' interactions) |',
        '| Favorite Agent | ' + stats.favoriteAgent + ' |',
        '| Memory Usage | ' + stats.memoryUsage + ' |',
        '',
        '## Top Skills',
        ''
      ];

      if (stats.topSkills.length > 0) {
        lines.push('| Skill | Usage Count | Rating |');
        lines.push('|-------|-------------|--------|');
        for (const skill of stats.topSkills) {
          lines.push('| ' + skill.name + ' | ' + skill.usageCount + ' | ' + skill.rating.toFixed(1) + '% |');
        }
      } else {
        lines.push('No skills tracked yet.');
      }
      lines.push('');

      lines.push('## Recent Insights');
      lines.push('');
      if (stats.recentInsights.length > 0) {
        for (const ins of stats.recentInsights) {
          lines.push('- **' + ins.title + '**: ' + ins.message);
        }
      } else {
        lines.push('No insights generated yet. Continue interacting to generate insights.');
      }
      lines.push('');

      lines.push('## Recent Patterns');
      lines.push('');
      if (stats.recentPatterns.length > 0) {
        for (const pat of stats.recentPatterns) {
          lines.push('- **' + pat.label + '** (' + pat.category + '): ' + pat.description);
        }
      } else {
        lines.push('No patterns discovered yet.');
      }
      lines.push('');

      lines.push('## Evolution Timeline');
      lines.push('');
      if (recentTimeline.length > 0) {
        for (const event of recentTimeline) {
          lines.push('- `' + event.timestamp + '` [' + event.type + '] ' + event.detail);
        }
      } else {
        lines.push('No timeline events recorded yet.');
      }
      lines.push('');

      return lines.join('\n');
    }
  };
})();

// Make SelfLearning globally accessible (works in both browser and Node.js)
if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = SelfLearning;
} else if (typeof window !== 'undefined') {
  window.SelfLearning = SelfLearning;
}
