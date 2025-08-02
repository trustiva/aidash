import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '../../lib/queryClient';
import { 
  Bot,
  FileText,
  Sparkles,
  Copy,
  Download,
  Send,
  Loader2
} from 'lucide-react';

interface ProposalGeneratorProps {
  onClose?: () => void;
}

const ProposalGenerator: React.FC<ProposalGeneratorProps> = ({ onClose }) => {
  const [jobDescription, setJobDescription] = useState('');
  const [clientName, setClientName] = useState('');
  const [generatedProposal, setGeneratedProposal] = useState<any>(null);
  const queryClient = useQueryClient();

  const generateProposalMutation = useMutation({
    mutationFn: (data: { jobDescription: string; clientInfo: { name: string } }) =>
      apiRequest('/api/ai/generate-proposal', {
        method: 'POST',
        body: JSON.stringify(data),
      }),
    onSuccess: (data) => {
      setGeneratedProposal(data.data);
    },
  });

  const saveProposalMutation = useMutation({
    mutationFn: (proposalData: any) =>
      apiRequest('/api/proposals', {
        method: 'POST',
        body: JSON.stringify(proposalData),
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/proposals'] });
      queryClient.invalidateQueries({ queryKey: ['/api/proposals/recent'] });
      if (onClose) onClose();
    },
  });

  const handleGenerate = async () => {
    if (!jobDescription.trim()) return;
    
    await generateProposalMutation.mutateAsync({
      jobDescription,
      clientInfo: { name: clientName || 'Client' }
    });
  };

  const handleSaveProposal = async () => {
    if (!generatedProposal) return;
    
    await saveProposalMutation.mutateAsync({
      title: generatedProposal.title,
      content: generatedProposal.content,
      budget: generatedProposal.budget,
      clientEmail: '', // Will be filled later
      status: 'draft'
    });
  };

  const copyToClipboard = () => {
    if (generatedProposal) {
      navigator.clipboard.writeText(generatedProposal.content);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.3 }}
      className="bg-white rounded-xl shadow-2xl p-6 max-w-4xl mx-auto"
    >
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Proposal Generator</h2>
            <p className="text-gray-600">Create winning proposals in seconds</p>
          </div>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        )}
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        {/* Input Section */}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Client Name (Optional)
            </label>
            <input
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              placeholder="Enter client or company name"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Job Description *
            </label>
            <textarea
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              rows={8}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
              placeholder="Paste the job description here. Include requirements, budget, timeline, and any specific details..."
            />
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={handleGenerate}
            disabled={!jobDescription.trim() || generateProposalMutation.isPending}
            className="w-full bg-gradient-to-r from-purple-500 to-pink-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
          >
            {generateProposalMutation.isPending ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Generate Proposal</span>
              </>
            )}
          </motion.button>
        </div>

        {/* Output Section */}
        <div className="space-y-4">
          {generatedProposal ? (
            <div className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Generated Proposal</h3>
                <div className="flex space-x-2">
                  <button
                    onClick={copyToClipboard}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="w-4 h-4 text-gray-600" />
                  </button>
                  <button
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    title="Download as PDF"
                  >
                    <Download className="w-4 h-4 text-gray-600" />
                  </button>
                </div>
              </div>
              
              <div className="prose prose-sm max-w-none">
                <h4 className="text-lg font-semibold mb-2">{generatedProposal.title}</h4>
                <div className="bg-gray-50 p-4 rounded-lg mb-4">
                  <pre className="whitespace-pre-wrap text-sm text-gray-700 font-sans">
                    {generatedProposal.content}
                  </pre>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Proposed Budget: <strong>${generatedProposal.budget}</strong>
                  </span>
                </div>
              </div>

              <div className="flex space-x-3 mt-6">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSaveProposal}
                  disabled={saveProposalMutation.isPending}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
                >
                  {saveProposalMutation.isPending ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Saving...</span>
                    </>
                  ) : (
                    <>
                      <FileText className="w-4 h-4" />
                      <span>Save as Draft</span>
                    </>
                  )}
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Now</span>
                </motion.button>
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Bot className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">
                Enter a job description and click "Generate Proposal" to see AI-powered results
              </p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default ProposalGenerator;