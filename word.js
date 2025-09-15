const text = document.getElementById("enterText")
const wordResult = document.getElementById("wordresult")
const letterResult= document.getElementById("letterresult")
const sentenceResult = document.getElementById("sentenceresult")
const reset = document.getElementById("reset")
const report = document.getElementById("report")
let lettercount = 0;
let wordcount = 0;
let sentenceCount = 0;
let avgWordLength = 0;
let avgSentenceLength = 0;
let paragraphCount = 0;
let longestWord = ""
let shortestWord = ""
let mostFrequentWord = "";
let highestCount = 0;
let uniqueWords = new Set();
let uniqueWordCount = 0;
let longestSentence = "";
let shortestSentence = "";
let wordsPerMinute = 220;
let readingTime = 0;
text.addEventListener("input", function(){
    lettercount = text.value.trim().length
    letterResult.innerText = lettercount
    wordcount = text.value.trim().split(/\s+/).length
    paragraphCount = text.value.split(/\n+/).filter(p => p.trim().length > 0).length;
    if (text.value === ""){
        wordResult.innerText = 0
    }
    else{
        wordResult.innerText = wordcount
    }
    
    sentenceCount = text.value.split(/(?<=[.!?])\s+/).filter(s=>s.trim().length>0).length
    sentenceResult.innerText = sentenceCount
    if (wordcount>0){
        avgWordLength = (lettercount/wordcount).toFixed(2)
        avgSentenceLength = (wordcount/sentenceCount).toFixed(2)
        let words = text.value.trim().split(/\s+/)
        longestWord = words.reduce((a, b) => b.length > a.length ? b : a);
        shortestWord = words.reduce((a, b) => b.length < a.length ? b : a);
        let freqMap = {};
        for (let i = 0; i < words.length; i++) {
        let w = words[i].toLowerCase().replace(/[^\w]/g, "");
        if (w) {
            if (freqMap[w]) {
                freqMap[w]++;
            } else {
                freqMap[w] = 1;
            }
        }
    }
    
    for (let w in freqMap) {
        if (freqMap[w] > highestCount) {
            highestCount = freqMap[w];
            mostFrequentWord = w;
        }
    }
    readingTime = (wordcount / wordsPerMinute).toFixed(2);
    let word = text.value.trim().split(/\s+/).map(w => w.replace(/[^\w]/g, "").toLowerCase()).filter(w => w.length > 0);
    uniqueWords = new Set(word);
    uniqueWordCount = uniqueWords.size;
    }
});
reset.addEventListener("click", function(){
    if(text.value ===""){
        alert("No text")
        return;
    }
    else{text.value=""
    letterResult.innerText = 0
    wordResult.innerText = 0
    sentenceResult.innerText = 0}
})
report.addEventListener ("click", function(){
    if(text.value === ""){
        alert("No text to analyse")
        return;
    }
    else{
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF();

        let report = `
    --- Text Analysis Report ---
    Date: ${ new Date().toLocaleString()}
    Total characters = ${lettercount}
    Total Words = ${wordcount}
    Total Sentences = ${sentenceCount}
    Total Paragraphs = ${paragraphCount}

    Average Word Length = ${avgWordLength} letters
    Average Sentence Length = ${avgSentenceLength} words

    Longest Word = ${longestWord || NaN}
    Shortest Word = ${shortestWord || NaN}
    Most Frequent Word = (${mostFrequentWord}) appeared ${highestCount} times
    Unique Words = ${uniqueWordCount} 
    Unique Words = ${[...uniqueWords].join(", ")}
    
    
    Estimated Reading Time  = ${readingTime} minute(s)

    --- Original Text ---
    ${text.value}
    ----------------------------`

    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 10;

    // Wrap text
    const wrappedText = doc.splitTextToSize(report, pageWidth - margin * 2);

    let y = 10; // start position
    const lineHeight = 7; // spacing between lines

    wrappedText.forEach(line => {
        if (y + lineHeight > pageHeight - margin) {
            // Start a new page if we reach bottom
            doc.addPage();
            y = margin;
        }
        doc.text(line, margin, y);
        y += lineHeight;
    });

    doc.save("Text_Analysis_Report.pdf");
 }
});