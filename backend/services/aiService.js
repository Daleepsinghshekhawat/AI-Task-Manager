exports.suggestTaskMetadata = (title, description) => {
  // Mock AI Logic Service
  const content = (title + ' ' + (description || '')).toLowerCase();
  
  let priority = 'Medium';
  let estimatedHours = 2; // Default estimated completion time
  
  const highPriorityKeywords = ['urgent', 'asap', 'critical', 'important', 'immediately', 'due today'];
  const lowPriorityKeywords = ['whenever', 'someday', 'no rush', 'maybe', 'eventually'];
  
  const complexKeywords = ['build', 'design', 'architecture', 'develop', 'plan', 'research', 'refactor', 'full-stack'];
  const simpleKeywords = ['email', 'call', 'reply', 'check', 'review', 'read', 'ask'];
  
  if (highPriorityKeywords.some(kw => content.includes(kw))) {
    priority = 'High';
  } else if (lowPriorityKeywords.some(kw => content.includes(kw))) {
    priority = 'Low';
  }
  
  if (complexKeywords.some(kw => content.includes(kw))) {
    estimatedHours = Math.floor(Math.random() * 8) + 4; // 4 to 11 hours
  } else if (simpleKeywords.some(kw => content.includes(kw))) {
    estimatedHours = 1; // 1 hour for simple tasks
  } else {
    estimatedHours = Math.floor(Math.random() * 3) + 1; // 1 to 3 hours default
  }
  
  return {
    priority: priority,
    estimatedCompletionTime: `${estimatedHours} hour${estimatedHours > 1 ? 's' : ''}`
  };
};
