'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { FileText, Download, Copy, Loader2, User, Briefcase, GraduationCap, ArrowLeft } from 'lucide-react';
import Link from 'next/link';


interface ResumeData {
  personalInfo: {
    name: string;
    email: string;
    phone: string;
    location: string;
    linkedin: string;
  };
  summary: string;
  experience: string;
  education: string;
  skills: string;
  jobTitle: string;
  jobDescription: string;
}

export default function ResumeGeneratorPage() {
  const [resumeData, setResumeData] = useState<ResumeData>({
    personalInfo: {
      name: '',
      email: '',
      phone: '',
      location: '',
      linkedin: ''
    },
    summary: '',
    experience: '',
    education: '',
    skills: '',
    jobTitle: '',
    jobDescription: ''
  });
  const [generatedResume, setGeneratedResume] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resumeType, setResumeType] = useState('professional');

  const handleInputChange = (field: string, value: string, subField?: string) => {
    if (subField) {
      setResumeData(prev => ({
        ...prev,
        [field]: {
          ...prev[field as keyof ResumeData],
          [subField]: value
        }
      }));
    } else {
      setResumeData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const generateResume = async () => {
    if (!resumeData.personalInfo.name || !resumeData.experience) {
      alert('Please fill in at least your name and experience');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch('/api/playground/resume', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          resumeData,
          resumeType
        }),
      });

      const data = await response.json();
      setGeneratedResume(data.resume);
    } catch (error) {
      console.error('Error generating resume:', error);
      setGeneratedResume('Sorry, there was an error generating your resume. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedResume);
  };

  const downloadResume = () => {
    const element = document.createElement('a');
    const file = new Blob([generatedResume], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = `${resumeData.personalInfo.name.replace(/\s+/g, '_')}_Resume.txt`;
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const sampleData = () => {
    setResumeData({
      personalInfo: {
        name: 'John Smith',
        email: 'john.smith@email.com',
        phone: '(555) 123-4567',
        location: 'San Francisco, CA',
        linkedin: 'linkedin.com/in/johnsmith'
      },
      summary: 'Experienced software engineer with 5+ years in full-stack development',
      experience: 'Software Engineer at TechCorp (2019-2024): Developed web applications using React and Node.js, improved system performance by 40%',
      education: 'Bachelor of Science in Computer Science, Stanford University (2015-2019)',
      skills: 'JavaScript, React, Node.js, Python, AWS, Docker, Git',
      jobTitle: 'Senior Software Engineer',
      jobDescription: 'Looking for a senior software engineer role with focus on React and cloud technologies'
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <div className="container mx-auto px-4 py-8">
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
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Resume Builder
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Create professional, tailored resumes and cover letters using AI
              </p>
            </div>
          </div>
          <Badge variant="secondary" className="bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300">
            Career Tools
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
                  <User className="h-5 w-5" />
                  Resume Information
                </CardTitle>
                <CardDescription>
                  Fill in your details to generate a tailored resume
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Resume Type */}
                <div>
                  <Label htmlFor="resume-type">Resume Style</Label>
                  <Select value={resumeType} onValueChange={setResumeType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select resume style" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="professional">Professional</SelectItem>
                      <SelectItem value="creative">Creative</SelectItem>
                      <SelectItem value="technical">Technical</SelectItem>
                      <SelectItem value="executive">Executive</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Personal Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <h3 className="font-semibold">Personal Information</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={resumeData.personalInfo.name}
                        onChange={(e) => handleInputChange('personalInfo', e.target.value, 'name')}
                        placeholder="John Smith"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={resumeData.personalInfo.email}
                        onChange={(e) => handleInputChange('personalInfo', e.target.value, 'email')}
                        placeholder="john@email.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        value={resumeData.personalInfo.phone}
                        onChange={(e) => handleInputChange('personalInfo', e.target.value, 'phone')}
                        placeholder="(555) 123-4567"
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">Location</Label>
                      <Input
                        id="location"
                        value={resumeData.personalInfo.location}
                        onChange={(e) => handleInputChange('personalInfo', e.target.value, 'location')}
                        placeholder="San Francisco, CA"
                      />
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="linkedin">LinkedIn Profile</Label>
                    <Input
                      id="linkedin"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => handleInputChange('personalInfo', e.target.value, 'linkedin')}
                      placeholder="linkedin.com/in/yourprofile"
                    />
                  </div>
                </div>

                <Separator />

                {/* Professional Summary */}
                <div>
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Textarea
                    id="summary"
                    value={resumeData.summary}
                    onChange={(e) => handleInputChange('summary', e.target.value)}
                    placeholder="Brief overview of your professional background and key strengths..."
                    rows={3}
                  />
                </div>

                {/* Experience */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="h-4 w-4" />
                    <Label htmlFor="experience">Work Experience *</Label>
                  </div>
                  <Textarea
                    id="experience"
                    value={resumeData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value)}
                    placeholder="List your work experience, including job titles, companies, dates, and key achievements..."
                    rows={4}
                  />
                </div>

                {/* Education */}
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <GraduationCap className="h-4 w-4" />
                    <Label htmlFor="education">Education</Label>
                  </div>
                  <Textarea
                    id="education"
                    value={resumeData.education}
                    onChange={(e) => handleInputChange('education', e.target.value)}
                    placeholder="Your educational background, degrees, certifications..."
                    rows={2}
                  />
                </div>

                {/* Skills */}
                <div>
                  <Label htmlFor="skills">Skills</Label>
                  <Textarea
                    id="skills"
                    value={resumeData.skills}
                    onChange={(e) => handleInputChange('skills', e.target.value)}
                    placeholder="List your technical and soft skills..."
                    rows={2}
                  />
                </div>

                {/* Target Job */}
                <div className="space-y-4">
                  <h3 className="font-semibold">Target Position (Optional)</h3>
                  <div>
                    <Label htmlFor="job-title">Job Title</Label>
                    <Input
                      id="job-title"
                      value={resumeData.jobTitle}
                      onChange={(e) => handleInputChange('jobTitle', e.target.value)}
                      placeholder="Senior Software Engineer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="job-description">Job Description</Label>
                    <Textarea
                      id="job-description"
                      value={resumeData.jobDescription}
                      onChange={(e) => handleInputChange('jobDescription', e.target.value)}
                      placeholder="Paste the job description to tailor your resume..."
                      rows={3}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={generateResume} disabled={isLoading} className="flex-1">
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Generating...
                      </>
                    ) : (
                      <>
                        <FileText className="h-4 w-4 mr-2" />
                        Generate Resume
                      </>
                    )}
                  </Button>
                  <Button variant="outline" onClick={sampleData}>
                    Sample Data
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Output Section */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-fit">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Generated Resume
                  </span>
                  {generatedResume && (
                    <div className="flex gap-2">
                      <Button variant="outline" size="sm" onClick={copyToClipboard}>
                        <Copy className="h-4 w-4" />
                      </Button>
                      <Button variant="outline" size="sm" onClick={downloadResume}>
                        <Download className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardTitle>
                <CardDescription>
                  Your AI-generated resume will appear here
                </CardDescription>
              </CardHeader>
              <CardContent>
                {generatedResume ? (
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-4">
                      <Badge variant="secondary" className="capitalize">
                        {resumeType} Style
                      </Badge>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 max-h-96 overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-sm font-mono">
                        {generatedResume}
                      </pre>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                    <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p>Fill in your information and click "Generate Resume" to create your professional resume</p>
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
