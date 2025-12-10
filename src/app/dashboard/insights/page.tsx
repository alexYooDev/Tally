// ================================================
// AI Insights Page - Dedicated Page for AI-Powered Financial Analysis
// ================================================
'use client';

import { useState, useEffect } from 'react';
import { Sparkles, TrendingUp, AlertTriangle, Lightbulb, RefreshCw, Loader2, ChevronRight } from 'lucide-react';
import { toast } from 'sonner';
import { PageContainer } from '@/components';
import { Modal } from '@/components/ui/modal';
import { generateInsights, getRateLimitStatus } from './actions';
import type { InsightsResponse, Insight } from '@/lib/ai/types';

export default function InsightsPage() {
    const [insights, setInsights] = useState<InsightsResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [cached, setCached] = useState(false);
    const [cacheMetadata, setCacheMetadata] = useState<{
        createdAt: string;
        expiresAt: string;
    } | null>(null);
    const [rateLimitInfo, setRateLimitInfo] = useState<{
        used: number;
        limit: number;
        remaining: number;
    } | null>(null);
    const [selectedInsight, setSelectedInsight] = useState<Insight | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleGenerateInsights = async (forceRegenerate: boolean = false) => {
        setLoading(true);
        
        try {
            const result = await generateInsights(forceRegenerate);

            if (result.error) {
                toast.error(result.error);
                return;
            }

            if (result.data) {
                setInsights(result.data);
                setCached(result.cached || false);
                setCacheMetadata(result.cacheMetadata || null);
                setRateLimitInfo(result.rateLimitInfo || null);
                
                if (result.cached) {
                    toast.success('Loaded insights from cache');
                } else {
                    toast.success('Fresh insights generated successfully!');
                }
            }
        } catch (error) {
            toast.error('Failed to generate insights');
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    // Auto-load cached insights on page mount
    useEffect(() => {
        const loadCachedInsights = async () => {
            setLoading(true);
            try {
                const result = await generateInsights(false);
                
                if (result.data && !result.error) {
                    setInsights(result.data);
                    setCached(result.cached || false);
                    setCacheMetadata(result.cacheMetadata || null);
                    setRateLimitInfo(result.rateLimitInfo || null);
                    
                    // Only show toast if data was cached (silent if fresh generation)
                    if (result.cached) {
                        console.log('✅ Cached insights loaded on mount');
                    }
                }
            } catch (error) {
                console.error('Error loading insights on mount:', error);
                // Silent fail - user can still manually generate
            } finally {
                setLoading(false);
            }
        };
        
        loadCachedInsights();
    }, []); // Run once on mount

    const getInsightIcon = (type: string) => {
        switch (type) {
            case 'alert':
                return <AlertTriangle className="w-5 h-5" />;
            case 'trend':
                return <TrendingUp className="w-5 h-5" />;
            case 'recommendation':
                return <Lightbulb className="w-5 h-5" />;
            default:
                return <Sparkles className="w-5 h-5" />;
        }
    };

    const getInsightColor = (type: string) => {
        switch (type) {
            case 'alert':
                return 'from-red-500 to-orange-500';
            case 'trend':
                return 'from-blue-500 to-purple-500';
            case 'recommendation':
                return 'from-green-500 to-teal-500';
            default:
                return 'from-indigo-500 to-purple-500';
        }
    };

    const getPriorityBadge = (priority: string) => {
        const colors = {
            high: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            medium: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            low: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
        };
        
        return (
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[priority as keyof typeof colors]}`}>
                {priority}
            </span>
        );
    };

    const renderInsightCard = (insight: Insight) => (
        <div
            key={insight.id}
            onClick={() => {
                setSelectedInsight(insight);
                setIsModalOpen(true);
            }}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 border border-gray-200 dark:border-gray-700 
                       hover:shadow-lg transition-all duration-200 hover:scale-[1.02] cursor-pointer"
        >
            <div className="flex items-start gap-4">
                <div className={`p-3 rounded-lg bg-gradient-to-br ${getInsightColor(insight.type)} text-white flex-shrink-0`}>
                    {insight.icon ? (
                        <span className="text-2xl">{insight.icon}</span>
                    ) : (
                        getInsightIcon(insight.type)
                    )}
                </div>
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                            {insight.title}
                        </h3>
                        {getPriorityBadge(insight.priority)}
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 text-sm mb-2">
                        {insight.description}
                    </p>
                    {insight.actionSteps && insight.actionSteps.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400 font-medium">
                            <span>View detailed guidelines</span>
                            <ChevronRight className="w-4 h-4" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <PageContainer>
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">
                    <span className="bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                        AI Financial Insights
                    </span>
                </h1>
                <p className="text-gray-600 dark:text-gray-400">
                    Get personalized analysis and recommendations for your business
                </p>
            </div>

            {/* Empty State */}
            {!insights && !loading && (
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-gray-800 dark:to-gray-900 
                                rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full 
                                    bg-gradient-to-br from-indigo-500 to-purple-500 text-white mb-6">
                        <Sparkles className="w-10 h-10" />
                    </div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3">
                        Unlock AI-Powered Insights
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto">
                        Let AI analyze your financial data to discover trends, identify opportunities, 
                        and provide actionable recommendations.
                    </p>
                    <button
                        onClick={() => handleGenerateInsights(false)}
                        disabled={loading}
                        className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 
                                   text-white font-medium rounded-lg hover:from-indigo-700 hover:to-purple-700 
                                   transition-all duration-200 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Sparkles className="w-5 h-5" />
                        Generate Insights
                    </button>
                    
                    {rateLimitInfo && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                            {rateLimitInfo.remaining} of {rateLimitInfo.limit} generations remaining today
                        </p>
                    )}
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="bg-white dark:bg-gray-800 rounded-2xl p-12 text-center border border-gray-200 dark:border-gray-700">
                    <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Analyzing Your Financial Data...
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 text-sm">
                        This may take a few moments
                    </p>
                </div>
            )}

            {/* Insights Display */}
            {insights && !loading && (
                <div className="space-y-8">
                    {/* Header with Regenerate */}
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            {/* {cached && cacheMetadata && (
                                <div className="flex items-center gap-2 mb-1">
                                    <span className="inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full 
                                                    bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                                        <span>📦</span>
                                        Cached
                                    </span>
                                </div>
                            )} */}
                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                {cacheMetadata ? (
                                    <>
                                        Last updated: {new Date(cacheMetadata.createdAt).toLocaleString()}
                                        {' · '}
                                        Expires: {new Date(cacheMetadata.expiresAt).toLocaleString()}
                                    </>
                                ) : (
                                    <>Generated {new Date(insights.generatedAt).toLocaleString()}</>
                                )}
                            </p>
                            {rateLimitInfo && (
                                <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
                                    {rateLimitInfo.remaining} generations remaining today
                                </p>
                            )}
                        </div>
                        <button
                            onClick={() => handleGenerateInsights(true)}
                            disabled={loading}
                            className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 
                                       bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 
                                       transition-colors disabled:opacity-50"
                        >
                            <RefreshCw className="w-4 h-4" />
                            Regenerate
                        </button>
                    </div>

                    {/* Alerts */}
                    {insights.alerts && insights.alerts.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                🚨 <span>Alerts</span>
                            </h2>
                            <div className="space-y-4">
                                {insights.alerts.map(renderInsightCard)}
                            </div>
                        </div>
                    )}

                    {/* Trends */}
                    {insights.trends && insights.trends.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                📈 <span>Trends</span>
                            </h2>
                            <div className="space-y-4">
                                {insights.trends.map(renderInsightCard)}
                            </div>
                        </div>
                    )}

                    {/* Recommendations */}
                    {insights.recommendations && insights.recommendations.length > 0 && (
                        <div>
                            <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                💡 <span>Recommendations</span>
                            </h2>
                            <div className="space-y-4">
                                {insights.recommendations.map(renderInsightCard)}
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Insight Details Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => {
                    setIsModalOpen(false);
                    setSelectedInsight(null);
                }}
                title={selectedInsight?.title || 'Insight Details'}
                size="lg"
            >
                {selectedInsight && (
                    <div className="space-y-6">
                        {/* Header with icon and priority */}
                        <div className="flex items-start gap-4 pb-4 border-b border-gray-200 dark:border-gray-700">
                            <div className={`p-4 rounded-xl bg-gradient-to-br ${getInsightColor(selectedInsight.type)} text-white flex-shrink-0`}>
                                {selectedInsight.icon ? (
                                    <span className="text-3xl">{selectedInsight.icon}</span>
                                ) : (
                                    getInsightIcon(selectedInsight.type)
                                )}
                            </div>
                            <div className="flex-1">
                                <div className="flex items-start gap-2 mb-2">
                                    {getPriorityBadge(selectedInsight.priority)}
                                    <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 capitalize">
                                        {selectedInsight.type}
                                    </span>
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {selectedInsight.description}
                                </p>
                            </div>
                        </div>

                        {/* Action Steps */}
                        {selectedInsight.actionSteps && selectedInsight.actionSteps.length > 0 ? (
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                                    📋 <span>Detailed Guidelines</span>
                                </h3>
                                <div className="space-y-4">
                                    {selectedInsight.actionSteps.map((step, index) => (
                                        <div 
                                            key={index}
                                            className="flex gap-4 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg border border-gray-200 dark:border-gray-600"
                                        >
                                            <div className="flex-shrink-0 w-8 h-8 rounded-full bg-indigo-600 text-white flex items-center justify-center font-semibold text-sm">
                                                {index + 1}
                                            </div>
                                            <p className="flex-1 text-gray-700 dark:text-gray-300 leading-relaxed">
                                                {step}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-500 dark:text-gray-400">
                                    No detailed guidelines available for this insight.
                                </p>
                            </div>
                        )}

                        {/* Additional metadata */}
                        {selectedInsight.metadata && Object.keys(selectedInsight.metadata).length > 0 && (
                            <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                                <h4 className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
                                    Additional Information
                                </h4>
                                <div className="space-y-1">
                                    {Object.entries(selectedInsight.metadata).map(([key, value]) => (
                                        <div key={key} className="flex gap-2 text-sm">
                                            <span className="text-gray-500 dark:text-gray-400 capitalize">
                                                {key.replace(/_/g, ' ')}:
                                            </span>
                                            <span className="text-gray-700 dark:text-gray-300 font-medium">
                                                {String(value)}
                                            </span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </Modal>
        </PageContainer>
    );
}
