'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Calculator, Copy, Download, Loader2, ArrowLeft, BookOpen } from 'lucide-react';
import Link from 'next/link';

const mathTypes = [
  { id: 'algebra', name: 'Algebra', description: 'Linear equations, polynomials, factoring' },
  { id: 'calculus', name: 'Calculus', description: 'Derivatives, integrals, limits' },
  { id: 'geometry', name: 'Geometry', description: 'Area, volume, angles, proofs' },
  { id: 'trigonometry', name: 'Trigonometry', description: 'Sin, cos, tan, identities' },
  { id: 'statistics', name: 'Statistics', description: 'Mean, median, probability' },
  { id: 'arithmetic', name: 'Arithmetic', description: 'Basic operations, fractions, decimals' }
];

export default function MathSolverPage() {
  const [problem, setProblem] = useState('');
  const [mathType, setMathType] = useState('algebra');
  const [solution, setSolution] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showSteps, setShowSteps] = useState(true);

  const solveProblem = async () => {
    if (!problem.trim()) {
      alert('Please enter a math problem to solve');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/math-solver', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          problem,
          mathType,
          showSteps
        }),
      });

      const data = await response.json();
      setSolution(data.solution);
    } catch (error) {
      console.error('Error solving problem:', error);
      setSolution('Sorry, there was an error solving this problem. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copySolution = () => {
    navigator.clipboard.writeText(solution);
  };

  const downloadSolution = () => {
    const content = `Math Problem: ${problem}\n\nSolution:\n${solution}`;
    const element = document.createElement('a');
    const file = new Blob([content], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'math_solution.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const loadSampleProblem = () => {
    const sampleProblems: { [key: string]: string } = {
      'algebra': 'Solve for x: 2x + 5 = 13',
      'calculus': 'Find the derivative of f(x) = x³ + 2x² - 5x + 1',
      'geometry': 'Find the area of a circle with radius 7 cm',
      'trigonometry': 'Solve: sin(x) = 0.5 for 0 ≤ x ≤ 2π',
      'statistics': 'Find the mean and standard deviation of: 2, 4, 6, 8, 10',
      'arithmetic': 'Calculate: (3/4) + (2/3) - (1/6)'
    };
    setProblem(sampleProblems[mathType] || sampleProblems['algebra']);
  };

  const clearProblem = () => {
    setProblem('');
    setSolution('');
  };

  const selectedMathType = mathTypes.find(t => t.id === mathType);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-indigo-50 dark:from-gray-900 dark:via-green-900 dark:to-blue-900">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Math Solver
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Solve math problems with step-by-step explanations
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300">
            Learning Tools
          </Badge>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5" />
                  Math Problem
                </CardTitle>
                <CardDescription>
                  Enter your math problem and select the type
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Math Type Selection */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Problem Type</label>
                  <Select value={mathType} onValueChange={setMathType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select math type" />
                    </SelectTrigger>
                    <SelectContent>
                      {mathTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div>
                            <div className="font-medium">{type.name}</div>
                            <div className="text-sm text-gray-500">{type.description}</div>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {selectedMathType && (
                    <p className="text-sm text-gray-500 mt-1">{selectedMathType.description}</p>
                  )}
                </div>

                {/* Problem Input */}
                <div>
                  <label className="text-sm font-medium mb-2 block">Problem</label>
                  <Textarea
                    value={problem}
                    onChange={(e) => setProblem(e.target.value)}
                    placeholder="Enter your math problem here... (e.g., Solve for x: 2x + 5 = 13)"
                    className="min-h-[120px] resize-none"
                  />
                  <div className="flex justify-between items-center mt-2">
                    <span className="text-sm text-gray-500">{problem.length} characters</span>
                    <Button variant="link" size="sm" onClick={loadSampleProblem} className="p-0 h-auto">
                      Load Sample
                    </Button>
                  </div>
                </div>

                {/* Options */}
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="show-steps"
                    checked={showSteps}
                    onChange={(e) => setShowSteps(e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="show-steps" className="text-sm font-medium">
                    Show step-by-step solution
                  </label>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2">
                  <Button onClick={solveProblem} disabled={isLoading || !problem.trim()} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Solving...
                      </>
                    ) : (
                      <>
                        <Calculator className="h-4 w-4 mr-2" />
                        Solve Problem
                      </>
                    )}
                  </Button>
                  {problem && (
                    <Button onClick={clearProblem} variant="outline">
                      Clear
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Solution Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Solution
                  </span>
                  {solution && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copySolution}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadSolution}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Step-by-step solution will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {solution ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="capitalize">
                        {selectedMathType?.name}
                      </Badge>
                      {showSteps && (
                        <Badge variant="outline">
                          Step-by-step
                        </Badge>
                      )}
                    </div>
                    
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
                      <h4 className="font-semibold mb-2">Problem:</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-4 font-mono">
                        {problem}
                      </p>
                      
                      <h4 className="font-semibold mb-2">Solution:</h4>
                      <div className="text-sm whitespace-pre-wrap font-mono">
                        {solution}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <Calculator className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Enter a math problem and click "Solve Problem" to see the solution</p>
                    <p className="text-sm mt-2">Supports algebra, calculus, geometry, and more</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
