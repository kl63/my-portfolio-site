'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Code, ArrowLeft, BookOpen, Copy, Download, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import Link from 'next/link';

const programmingLanguages = [
  { id: 'javascript', name: 'JavaScript', extension: '.js' },
  { id: 'python', name: 'Python', extension: '.py' },
  { id: 'java', name: 'Java', extension: '.java' },
  { id: 'cpp', name: 'C++', extension: '.cpp' },
  { id: 'csharp', name: 'C#', extension: '.cs' },
  { id: 'php', name: 'PHP', extension: '.php' },
  { id: 'ruby', name: 'Ruby', extension: '.rb' },
  { id: 'go', name: 'Go', extension: '.go' },
  { id: 'rust', name: 'Rust', extension: '.rs' },
  { id: 'typescript', name: 'TypeScript', extension: '.ts' }
];

const explanationLevels = [
  { id: 'beginner', name: 'Beginner', description: 'Simple explanations for newcomers' },
  { id: 'intermediate', name: 'Intermediate', description: 'Moderate detail with some technical terms' },
  { id: 'advanced', name: 'Advanced', description: 'Detailed technical explanations' }
];

export default function CodeExplainerPage() {
  const [code, setCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [level, setLevel] = useState('intermediate');
  const [explanation, setExplanation] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const explainCode = async () => {
    if (!code.trim() || isLoading) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/explain-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code,
          language,
          level
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to explain code');
      }

      const data = await response.json();
      setExplanation(data.explanation);
    } catch (error) {
      console.error('Error explaining code:', error);
      setExplanation("I'm sorry, I couldn't explain the code right now. Please try again later.");
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(explanation);
  };

  const downloadExplanation = () => {
    const element = document.createElement('a');
    const file = new Blob([`Code:\n${code}\n\nExplanation:\n${explanation}`], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `code-explanation.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const loadSampleCode = (sampleCode: string) => {
    setCode(sampleCode);
  };

  const selectedLanguage = programmingLanguages.find(lang => lang.id === language);
  const selectedLevel = explanationLevels.find(lvl => lvl.id === level);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-indigo-100 dark:from-gray-900 dark:via-blue-900 dark:to-cyan-900">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-8"
        >
          <div className="flex items-center gap-4">
            <Link href="/playground">
              <Button variant="outline" size="icon">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </Link>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                Code Explainer
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Understand any code with plain English explanations
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Learning Tool
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Panel */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="h-5 w-5" />
                  Code Input
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Settings */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="language">Programming Language</Label>
                    <Select value={language} onValueChange={setLanguage}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select language" />
                      </SelectTrigger>
                      <SelectContent>
                        {programmingLanguages.map((lang) => (
                          <SelectItem key={lang.id} value={lang.id}>
                            {lang.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="level">Explanation Level</Label>
                    <Select value={level} onValueChange={setLevel}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select level" />
                      </SelectTrigger>
                      <SelectContent>
                        {explanationLevels.map((lvl) => (
                          <SelectItem key={lvl.id} value={lvl.id}>
                            {lvl.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {selectedLevel?.description}
                </p>

                {/* Code Input */}
                <div className="space-y-2">
                  <Label htmlFor="code-input">Code to Explain</Label>
                  <Textarea
                    id="code-input"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="Paste your code here..."
                    className="min-h-[300px] font-mono text-sm resize-none"
                  />
                </div>

                {/* Action Button */}
                <Button 
                  onClick={explainCode}
                  disabled={!code.trim() || isLoading}
                  className="w-full"
                  size="lg"
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing Code...
                    </>
                  ) : (
                    <>
                      <BookOpen className="h-4 w-4 mr-2" />
                      Explain Code
                    </>
                  )}
                </Button>

                {/* Sample Code */}
                <div className="space-y-2">
                  <Label>Try with sample code:</Label>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadSampleCode(`function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

console.log(fibonacci(10));`)}
                      className="w-full text-left justify-start text-xs h-auto p-2 font-mono"
                    >
                      JavaScript: Fibonacci Function
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadSampleCode(`def quicksort(arr):
    if len(arr) <= 1:
        return arr
    pivot = arr[len(arr) // 2]
    left = [x for x in arr if x < pivot]
    middle = [x for x in arr if x == pivot]
    right = [x for x in arr if x > pivot]
    return quicksort(left) + middle + quicksort(right)`)}
                      className="w-full text-left justify-start text-xs h-auto p-2 font-mono"
                    >
                      Python: Quicksort Algorithm
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => loadSampleCode(`class BankAccount {
    private double balance;
    
    public BankAccount(double initialBalance) {
        this.balance = initialBalance;
    }
    
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
        }
    }
    
    public double getBalance() {
        return balance;
    }
}`)}
                      className="w-full text-left justify-start text-xs h-auto p-2 font-mono"
                    >
                      Java: Bank Account Class
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Panel */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Code Explanation
                  </CardTitle>
                  {explanation && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadExplanation}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </CardHeader>
              <CardContent>
                <div className="min-h-[400px]">
                  {isLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="text-center">
                        <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-500" />
                        <p className="text-gray-500 dark:text-gray-400">
                          Analyzing your code...
                        </p>
                      </div>
                    </div>
                  ) : explanation ? (
                    <div className="space-y-4">
                      <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <div className="prose prose-sm max-w-none dark:prose-invert">
                          <div className="whitespace-pre-wrap">{explanation}</div>
                        </div>
                      </div>
                      
                      {/* Code Stats */}
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="font-medium">Language</div>
                          <div className="text-gray-600 dark:text-gray-400">{selectedLanguage?.name}</div>
                        </div>
                        <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                          <div className="font-medium">Lines of Code</div>
                          <div className="text-gray-600 dark:text-gray-400">
                            {code.split('\n').length}
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center h-64 text-gray-500 dark:text-gray-400">
                      <div className="text-center">
                        <Code className="h-12 w-12 mx-auto mb-4 opacity-50" />
                        <p>Your code explanation will appear here</p>
                        <p className="text-sm mt-2">Paste your code and click "Explain Code"</p>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
