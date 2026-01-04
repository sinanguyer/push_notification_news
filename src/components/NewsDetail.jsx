import { useState, useEffect } from 'react';
import { ArrowLeft, ExternalLink } from 'lucide-react';
import { format } from 'date-fns';
import { de } from 'date-fns/locale';
import { translateText } from '../services/translation';

function NewsDetail({ article, onBack }) {
    const [lang, setLang] = useState('de'); // 'de', 'tr', 'en'
    const [translatedTitle, setTranslatedTitle] = useState(article.title);
    const [translatedContent, setTranslatedContent] = useState(article.content);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const translate = async () => {
            if (lang === 'de') {
                setTranslatedTitle(article.title);
                setTranslatedContent(article.content);
                return;
            }

            setLoading(true);
            try {
                const tTitle = await translateText(article.title, lang);
                const tContent = await translateText(article.content || '', lang);
                setTranslatedTitle(tTitle);
                setTranslatedContent(tContent);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        translate();
    }, [lang, article]);

    return (
        <div className="animate-in slide-in-from-right duration-300">
            <div className="flex items-center justify-between mb-4">
                <button onClick={onBack} className="flex items-center gap-1 text-slate-400 hover:text-white pl-0">
                    <ArrowLeft size={20} />
                    Back
                </button>

                <div className="flex bg-slate-800 rounded-lg p-1 gap-1">
                    <button
                        onClick={() => setLang('de')}
                        className={`px-3 py-1 text-sm rounded ${lang === 'de' ? 'bg-blue-600 text-white' : 'bg-transparent text-slate-400'}`}>
                        🇩🇪 DE
                    </button>
                    <button
                        onClick={() => setLang('tr')}
                        className={`px-3 py-1 text-sm rounded ${lang === 'tr' ? 'bg-blue-600 text-white' : 'bg-transparent text-slate-400'}`}>
                        🇹🇷 TR
                    </button>
                    <button
                        onClick={() => setLang('en')}
                        className={`px-3 py-1 text-sm rounded ${lang === 'en' ? 'bg-blue-600 text-white' : 'bg-transparent text-slate-400'}`}>
                        🇬🇧 EN
                    </button>
                </div>
            </div>

            <article className="card mt-2 min-h-[60vh]">
                {loading ? (
                    <div className="flex justify-center p-10 animate-pulse text-slate-500">
                        Translating...
                    </div>
                ) : (
                    <>
                        <div className="flex flex-wrap items-center gap-3 text-sm text-slate-500 mb-4 border-b border-slate-700/50 pb-4">
                            <span className="font-semibold text-blue-400">{article.source}</span>
                            <span>•</span>
                            <span>{article.pubDate ? format(new Date(article.pubDate), 'dd. MMMM yyyy', { locale: de }) : ''}</span>
                        </div>

                        <h1 className="text-2xl font-bold text-white mb-6 leading-snug">
                            {translatedTitle}
                        </h1>

                        <div className="prose prose-invert prose-slate max-w-none text-slate-300 leading-relaxed space-y-4">
                            {translatedContent ? (
                                <p>{translatedContent}</p>
                            ) : (
                                <p className="italic text-slate-500">Keine Zusammenfassung verfügbar.</p>
                            )}
                        </div>

                        <div className="mt-8 pt-6 border-t border-slate-700/50">
                            <a href={article.link} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-lg font-medium transition-colors w-full justify-center">
                                <ExternalLink size={18} />
                                Originalartikel lesen
                            </a>
                        </div>
                    </>
                )}
            </article>
        </div>
    );
}

export default NewsDetail;
