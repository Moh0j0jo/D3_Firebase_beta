import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs } from 'firebase/firestore';
import { doc, onSnapshot, query } from "firebase/firestore";

// TODO: Replace the following with your app's Firebase project configuration
const firebaseConfig = {
  apiKey: "AIzaSyDMw--Z3Zl-e-y1TUnXMmghE5Dd7Gl5ChE",
  authDomain: "udemy-d3-firebase-23286.firebaseapp.com",
  projectId: "udemy-d3-firebase-23286",
  storageBucket: "udemy-d3-firebase-23286.appspot.com",
  messagingSenderId: "124615150939",
  appId: "1:124615150939:web:2408f5cbfdc3b3b9a1de7e",
  measurementId: "G-F3K0M89R9G"
};


const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const colRef = collection(db, 'dishes')


// select the svg container first
const svg = d3.select('.canvas')
  .append('svg')
    .attr('width', 600)
    .attr('height', 600);

// create margins & dimensions
const margin = {top: 20, right: 20, bottom: 100, left: 100};
const graphWidth = 600 - margin.left - margin.right;
const graphHeight = 600 - margin.top - margin.bottom;

const graph = svg.append('g')
  .attr('width', graphWidth)
  .attr('height', graphHeight)
  .attr('transform', `translate(${margin.left}, ${margin.top})`);

// create axes groups
const xAxisGroup = graph.append('g')
  .attr('transform', `translate(0, ${graphHeight})`)

xAxisGroup.selectAll('text')
  .attr('fill', 'orange')
  .attr('transform', 'rotate(-40)')
  .attr('text-anchor', 'end');

const yAxisGroup = graph.append('g');

const y = d3.scaleLinear()
    .range([graphHeight, 0]);

const x = d3.scaleBand()
  .range([0, graphWidth])
  .paddingInner(0.2)
  .paddingOuter(0.2);

// create & call axes
const xAxis = d3.axisBottom(x);
const yAxis = d3.axisLeft(y)
  .ticks(3)
  .tickFormat(d => d + ' orders');

// the update function
const update = (data) => {

  // join the data to circs
  const rects = graph.selectAll('rect')
    .data(data);

  //remove exit selection
  //rects.exit().remove();

  // update the domains
  y.domain([0, d3.max(data, d => d.orders)]);
  x.domain(data.map(item => item.name));

  // add attrs to rects already in the DOM
  rects.attr('width', x.bandwidth)
    .attr("height", d => graphHeight - y(d.orders))
    .attr('fill', 'orange')
    .attr('x', d => x(d.name))
    .attr('y', d => y(d.orders));

  // append the enter selection to the DOM
  rects.enter()
    .append('rect')
      .attr('width', x.bandwidth)
      .attr("height", d => graphHeight - y(d.orders))
      .attr('fill', 'orange')
      .attr('x', (d) => x(d.name))
      .attr('y', d => y(d.orders));

  xAxisGroup.call(xAxis);
  yAxisGroup.call(yAxis);

};

// getDocs(colRef)
//   .then(res => {

//   const data = [];
  
//   res.docs.forEach(doc => {
//     data.push(doc.data());
//   });

//   update(data);

// });


let data = []

const unsub = onSnapshot(colRef, (snapshot)  => {


 snapshot.docChanges().forEach( change => {
  // console.log('Document ID:', doc.id);
  // console.log('Document Data:', doc.data());
  console.log(change)
  console.log(change.doc.data())
    
    const doc = {...change.doc.data(), id: change.doc.id};

    
    switch (change.type) {
      case 'added':
        data.push(doc);
        break;
      case 'modified':
        const index = data.findIndex(item => { item.id == doc.id})
        data[index] = doc;
        break;
      case 'removed':
        data = data.filter(item => item.id !== doc.id);
        break;
      default:
        break;
    }

  })
 
  update(data)
})
