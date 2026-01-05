import { format } from 'date-fns';
import { de } from 'date-fns/locale';

const KEYWORDS = [
    'Familiengeld', 'Krippengeld', 'ZBFS', 'Kindergeld',
    'Aufenthaltsgesetz', 'Einbürgerung', 'Miete', 'Nebenkosten', 'Schule', 'Visum',
    'Bad Wörishofen', 'Mindelheim', 'Straßensperrung', 'Ausländerbehörde',
    'Müllabfuhr', 'Wasser', 'Kita', 'Kindergarten'
];

function NewsList({ news, onArticleClick }) {
    const highlightKeywords = (text) => {
        if (!text) return null;
        let hasKeyword = false;

        KEYWORDS.forEach(keyword => {
            if (text.toLowerCase().includes(keyword.toLowerCase())) hasKeyword = true;
        });

        return hasKeyword;
    };

    return (
        <div className="flex flex-col gap-4">
            {news.map((item) => {
                const isImportant = highlightKeywords(item.title) || highlightKeywords(item.content);

                return (
                    <article
                        key={item.id}
                        onClick={() => onArticleClick(item)}
                        className={`card cursor-pointer relative overflow-hidden group border-l-4 ${isImportant ? 'border-l-amber-500' : 'border-l-transparent'}`}
                    >
                        {isImportant && (
                            <div className="absolute top-0 right-0 bg-amber-500 text-black text-[10px] font-bold px-2 py-0.5 rounded-bl-lg">
                                IMPORTANT
                            </div>
                        )}

                        <div className="flex justify-between items-start mb-2">
                            <span className="text-xs font-semibold text-blue-400 uppercase tracking-wide">
                                {item.source}
                            </span>
                            <span className="text-xs text-slate-500">
                                {item.pubDate ? format(new Date(item.pubDate), 'dd. MMM yyyy', { locale: de }) : ''}
                            </span>
                        </div>

                        <h2 className="text-lg font-bold text-slate-100 mb-2 leading-snug group-hover:text-blue-400 transition-colors">
                            {item.title}
                        </h2>

                        <p className="text-slate-400 text-sm line-clamp-3">
                            {item.content || "Klicken Sie hier, um den Artikel zu lesen."}
                        </p>
                    </article>
                );
            })}
        </div>
    );
}

export default NewsList;
