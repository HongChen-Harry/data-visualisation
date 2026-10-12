'use strict';
// Page headings are separate from the specifications, which remain editor-ready.
const charts = [
  { number:2, file:'graph_2_council_expenditure_map.json', idiom:'Proportional symbol map', title:'Council Spending by Location', subtitle:'2024–25 · Circle area represents total expenditure · AUD', guide:'Larger circles show higher total expenditure, with the same area scale in both maps. Choose a council or hover over a circle to highlight it and its boundary; other councils fade when one is selected. Circles sit at representative locations inside each council, not at council offices. Hover for total expenditure, population and expenditure per resident. The largest total belongs to Melbourne; compare Figure 4 for spending per resident.' },
  { number:10, file:'graph_10_public_toilet_locations.json', idiom:'Point location map', title:'Public Toilet Locations', subtitle:'1 April 2026 extract · Each dot represents one listed facility · Victoria', guide:'Each equal-size dot represents a listed public toilet facility. Choose Accessible facilities to show only those marked accessible in the source. The selected council / LGA is shaded light blue and outlined in blue. Council names label the central view; larger regional councils are labelled on the state map, and selecting any council shows its name. Choose a council / LGA region, then hover for the facility name, town, address and accessibility listing. The dashed box marks the central Melbourne detail; edge councils are partly shown. Locations alone do not establish travel access or service quality. Two VIC records with coordinates outside the state extent are excluded. Twelve locations that cannot be matched to an ABS area are retained under Unmatched location.' },
  { number:1, file:'graph_1_population_density.json', idiom:'Choropleth map', title:'Population Density Across Victoria', subtitle:'30 June 2025 · Residents per km² · Victoria and an enlarged inner Melbourne view', guide:'Darker blue shows more residents per square kilometre, not more residents in total. Both maps use the same six density classes. Hover over a council for its population, original area and density. The dashed box marks the extent of the enlarged panel; councils at its edges are only partly shown. Leaders identify the councils with the highest and lowest density across all 79 councils.' },
  { number:3, file:'graph_3_treemap.json', mode:'vega', idiom:'Treemap', title:'Victorian Council Expenditure by Service', subtitle:'2024–25 · Area and blue brightness encode expenditure · AUD', guide:'Compare rectangle areas to see each service’s share of expenditure. Darker blue indicates a larger amount. Hover for the full category, amount and share; the Other label connects to its narrow rectangle.' },
  { number:4, file:'graph_4_boxplot.json', idiom:'Box plot', title:'Council Expenditure per Resident', subtitle:'2024–25 · AUD per resident · Dots show councils; boxes show the middle 50%', guide:'A dot represents a council. The line inside each box is the median: half of the councils fall above it and half below. The box spans the middle half of values. Dashed leaders connect the highlighted medians and highest council to their annotations.' },
  { number:5, file:'graph_5_waste_scatterplot.json', idiom:'Scatterplot', title:'Waste Collection Cost and Landfill Diversion', subtitle:'2024–25 · Garbage collection cost per bin versus kerbside landfill diversion', guide:'Each point is a council. Further right means higher garbage collection cost per bin; higher up means more kerbside waste diverted from landfill. Filter by council group and hover for details. These measures describe different parts of waste services, so the comparison does not establish causation.' },
  { number:6, file:'graph_6_waste_heatmap.json', idiom:'Heatmap', title:'Landfill Diversion Across Councils', subtitle:'2020–21 to 2024–25 · Percentage diverted from landfill · Complete records only', guide:'Read across a row to follow one council over five years. Darker cells indicate a higher diversion percentage, with the exact value printed in each cell. Choose a council group to compare peers. Councils missing any year are excluded from this chart.' },
  { number:7, file:'graph_7_waste_trend.json', idiom:'Time series', title:'Reported Kerbside Waste Collection', subtitle:'2001–02 to 2023–24 · Reported tonnes collected · Coverage varies by year', guide:'Follow each waste stream through time. Blue brightness and line patterns distinguish garbage, recyclables and organics. Highlight leaders point to the garbage peak, the organics crossover and the latest organics total. Hover to check reporting coverage; collection does not necessarily mean recycling.' },
  { number:8, file:'graph_8_library_parallel_coordinates.json', idiom:'Parallel coordinates', title:'Library Service Profiles', subtitle:'2024–25 · Each per-resident measure is scaled independently from 0 to 100', guide:'Choose a library service to highlight its profile against the other services. Each axis has a separate scale: 0 is the lowest and 100 the highest value for that measure. Labels show the actual per-resident values. The connecting line is a profile, not a trend or a combined performance score.' },
  { number:9, file:'graph_9_library_bump_chart.json', idiom:'Bump chart', title:'Library Visit Rankings Over Time', subtitle:'2022–23 to 2024–25 · Latest top eight by visits per resident · Ranked among 50', guide:'Rank 1 is the highest number of branch visits per resident. Follow a line to see a service’s changing position. Only the latest top eight are displayed, but ranks are calculated among all 50 services. Changes in rank do not alone establish changes in visits or service quality.' },
  { number:11, file:'graph_11_service_satisfaction.json', idiom:'Bar chart', title:'Community Satisfaction with Public Services', subtitle:'2025 · Eight selected service areas · State-wide performance index out of 100', guide:'Longer, darker bars indicate higher service ratings. This index is out of 100 and is not a percentage. The highest and lowest annotations refer to all 28 survey service areas, not only the eight shown. These are state-wide ratings, not ratings for each council.' }
];
function buildChartCard(chart) {
  const article=document.createElement('article'); article.className='chart-card'; article.id=`figure-${chart.number}`; article.setAttribute('aria-labelledby',`title-${chart.number}`);
  const title=document.createElement('h3'); title.id=`title-${chart.number}`; title.textContent=chart.title;
  const subtitle=document.createElement('p'); subtitle.className='chart-subtitle'; subtitle.textContent=chart.subtitle;
  const viewport=document.createElement('div'); viewport.className='chart-scroll';
  const host=document.createElement('div'); host.id=`graph-${chart.number}`; host.className='chart-host chart-loading'; host.setAttribute('aria-busy','true'); const panel=document.createElement('div'); panel.className='chart-panel'; panel.append(title,subtitle,host); viewport.append(panel);
  const error=document.createElement('p'); error.className='chart-error'; error.hidden=true; error.setAttribute('role','alert');
  article.append(viewport,error); return {article,host,error};
}
async function renderChart(chart,elements) {
  try {
    if (!window.vegaEmbed) throw new Error('The chart library could not load. Check your internet connection.');
    const response=await fetch(`./${chart.file}`); if (!response.ok) throw new Error(`Chart file returned HTTP ${response.status}.`);
    const spec=await response.json(); delete spec.title;
    // SVG keeps charts sharp on high-density displays and when resized.
    await vegaEmbed(elements.host,spec,{mode:chart.mode||'vega-lite',renderer:'svg',actions:false});
    elements.host.querySelector('svg')?.setAttribute('aria-label',`${chart.title}. ${chart.subtitle}`);
  } catch (error) {
    console.error(`Figure ${chart.number}:`,error); elements.error.hidden=false; elements.error.textContent=`Unable to load this chart. ${error.message} Open the page with VS Code Live Server and refresh.`;
  } finally { elements.host.classList.remove('chart-loading'); elements.host.setAttribute('aria-busy','false'); }
}
const chartByNumber=new Map(charts.map(chart=>[chart.number,chart]));
const pending=[];
for (const stack of document.querySelectorAll('[data-charts]')) for (const number of stack.dataset.charts.split(',').map(Number)) {
  const chart=chartByNumber.get(number); const elements=buildChartCard(chart); stack.append(elements.article); pending.push(renderChart(chart,elements));
}
Promise.allSettled(pending).then(() => {
  const target = document.getElementById(location.hash.slice(1));
  if (target) target.scrollIntoView({ behavior: 'instant', block: 'start' });
});
// Links move through the story; they never replace or hide major sections.
const chapters=[...document.querySelectorAll('.chapter')];
const chapterLinks=[...document.querySelectorAll('.chapter-nav a')];
const progress=document.getElementById('reading-progress');
let scrollScheduled=false;
function updateReadingPosition() {
  const available=document.documentElement.scrollHeight-window.innerHeight;
  progress.style.width=`${available>0?Math.min(100,Math.max(0,window.scrollY/available*100)):0}%`;
  let current=chapters[0].id;
  for (const chapter of chapters) if (chapter.getBoundingClientRect().top<=150) current=chapter.id;
  for (const link of chapterLinks) { if (link.hash===`#${current}`) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); }
  scrollScheduled=false;
}
window.addEventListener('scroll',()=>{ if (!scrollScheduled) { scrollScheduled=true; requestAnimationFrame(updateReadingPosition); } },{passive:true});
window.addEventListener('resize',updateReadingPosition); updateReadingPosition();
