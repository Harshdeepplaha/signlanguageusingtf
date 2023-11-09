// Import dependencies
import React, { useRef, useState, useEffect } from "react";
import * as tf from "@tensorflow/tfjs";
import Webcam from "react-webcam";
import "./App.css";
// import { nextFrame } from "@tensorflow/tfjs";
// 2. TODO - Import drawing utility here
// e.g. import { drawRect } from "./utilities";
// import { drawRect } from "./utilities";


import {Container, Row, Col, Card, Button, ListGroup} from 'react-bootstrap';
import Navbar from 'react-bootstrap/Navbar';


















































function App() {

 
 

  






  const [isDetecting, setIsDetecting] = useState(false);

const [detectedClassNames, setDetectedClassNames] = useState([]);

  const webcamRef = useRef(null);
  const canvasRef = useRef(null);






const labelMap = {
    1:{name:'Hello', color:'red'},
    2:{name:'Thank You', color:'yellow'},
    3:{name:'I Love You', color:'lime'},
    4:{name:'Yes', color:'blue'},
    5:{name:'No', color:'purple'},
}

const { speechSynthesis, SpeechSynthesisUtterance } = window;

function speakClassName(className) {
  const utterance = new SpeechSynthesisUtterance(className);
  speechSynthesis.speak(utterance);
}



const classNames = [];
// Define a drawing function
const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx)=>{



    for(let i=0; i<=boxes.length; i++){
        if(boxes[i] && classes[i] && scores[i]>threshold){
            // Extract variables
            const [y,x,height,width] = boxes[i]
            const text = classes[i]
            
            // Set styling
            ctx.strokeStyle = labelMap[text]['color']
            ctx.lineWidth = 10
            ctx.fillStyle = 'white'
            ctx.font = '30px Arial'         
            
            // DRAW!!
            ctx.beginPath()
            ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i]*100)/100, x*imgWidth, y*imgHeight-10)
            ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/2, height*imgHeight/1.5);
            ctx.stroke()


       classNames.push(labelMap[text]['name']);
        speakClassName(labelMap[text]['name']);

       
        
        
    }
}

 setDetectedClassNames((prevClassNames) => [...prevClassNames, ...classNames].slice(-5));

};








































   

  
 

  // Main function
  const runCoco = async () => {
    // 3. TODO - Load network 
    // e.g. const net = await cocossd.load();
    // https://tensorflowjsrealtimeforhack.s3.us-east.cloud-object-storage.appdomain.cloud/model.json
    const net = await tf.loadGraphModel('https://tensorflowjsrealtimeforhack.s3.us-east.cloud-object-storage.appdomain.cloud/model.json')
    
    //  Loop and detect hands
    setInterval(() => {
      detect(net);
    }, 16.7);
  };

  const detect = async (net) => {
    // Check data is available
    if (
      typeof webcamRef.current !== "undefined" &&
      webcamRef.current !== null &&
      webcamRef.current.video.readyState === 4
    ) {
      // Get Video Properties
      const video = webcamRef.current.video;
      const videoWidth = webcamRef.current.video.videoWidth;
      const videoHeight = webcamRef.current.video.videoHeight;

      // Set video width
      webcamRef.current.video.width = videoWidth;
      webcamRef.current.video.height = videoHeight;

      // Set canvas height and width
      canvasRef.current.width = videoWidth;
      canvasRef.current.height = videoHeight;

      // 4. TODO - Make Detections
      const img = tf.browser.fromPixels(video)
      const resized = tf.image.resizeBilinear(img, [640,480])
      const casted = resized.cast('int32')
      const expanded = casted.expandDims(0)
      const obj = await net.executeAsync(expanded)
      console.log(obj)

      const boxes = await obj[1].array()
      const classes = await obj[2].array()
      const scores = await obj[4].array()
      
      // Draw mesh
      const ctx = canvasRef.current.getContext("2d");

      // 5. TODO - Update drawing utility
      // drawSomething(obj, ctx)  
      
      requestAnimationFrame(() => {
        drawRect(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, ctx);
         



      });
    

    

      tf.dispose(img)
      tf.dispose(resized)
      tf.dispose(casted)
      tf.dispose(expanded)
      tf.dispose(obj)

     

   

    }
  };

  useEffect(()=>{runCoco()},[]);

  return (

    





    <div className="App">


<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
  integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
  crossorigin="anonymous"
/>















  <Navbar style={{ backgroundColor: '#0072DC' }}>
        <Navbar.Brand style={{ marginLeft: '40px', color:'white',  fontWeight:'bolder'}}>Sign Language to Audio</Navbar.Brand>
       </Navbar>



       





      <header className="App-header">





        
            <Container> 
              <Row>
                <Col> 
                
                <Card style={{ width: "50rem", borderRadius:'20px', backgroundColor: "#F4F4F4", boxShadow:'0 4px 6px rgba(0, 0, 0, 0.3)' }}>
                  
                  
                  <div className="video-feed" >
      
       <Webcam
          ref={webcamRef}
          muted={true} 
          style={{
            position: "relative",
            marginLeft: "auto",
            marginRight: "auto",
            marginTop:"30px",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 9,
            width: 640,
            height: 480,
            borderRadius: 20,
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.9)'
          }}
        /> 

         <canvas
          ref={canvasRef}
          style={{
            position: "absolute",
            marginLeft: "auto",
            marginRight: "auto",
            left: 0,
            right: 0,
            textAlign: "center",
            zindex: 8,
            width: 640,
            height: 480,
          }}
        />
      
    </div>
  
  <Card.Body  >
    <Card.Title>Live video feed </Card.Title>
    <Card.Text>
      Press button to start translating 
    </Card.Text>
    <Button style={{width:'200px', height:'70px'}} size="lg" block variant="primary"> Translate</Button>
  </Card.Body>
</Card>
                
                
                
                </Col>
                <Col style={{ marginLeft:'30px',  backgroundColor:'#3C89D0', borderRadius:'20px', boxShadow:'0 4px 6px rgba(0, 0, 0, 0.5)', border:'10px', }} className="transcription">
                <h1 style={{color:'white', marginTop:'30px', }}>History</h1>
<ListGroup style={{marginTop:'40px', borderRadius:'20px', boxShadow:'0 4px 6px rgba(0, 0, 0, 0.5)'}} variant="flush">
        {detectedClassNames.map((className, index) => (
          <ListGroup.Item key={index}>{className}</ListGroup.Item>
        ))}
      </ListGroup>





                </Col>
              </Row>
            </Container>
          


 
  


        


        
        
       
      </header>
      
     

      

      
          

    </div>
  );
}

export default App;






// import React, { useRef, useState, useEffect } from "react";
// import * as tf from "@tensorflow/tfjs";
// import Webcam from "react-webcam";
// import "./App.css";
// import { Container, Row, Col, Card, Button, ListGroup } from 'react-bootstrap';
// import Navbar from 'react-bootstrap/Navbar';

// function App() {
//   const webcamRef = useRef(null);
//   const canvasRef = useRef(null);
//   const [detectedClassNames, setDetectedClassNames] = useState([]);
//   const [lastDetectedClass, setLastDetectedClass] = useState("");
//   const timeoutRef = useRef(null);
//   const [isDetecting, setIsDetecting] = useState(false);

//   const labelMap = {
//     1: { name: 'Hello', color: 'red' },
//     2: { name: 'Thank You', color: 'yellow' },
//     3: { name: 'I Love You', color: 'lime' },
//     4: { name: 'Yes', color: 'blue' },
//     5: { name: 'No', color: 'purple' },
//   };

//   const { speechSynthesis, SpeechSynthesisUtterance } = window;

//   function speakClassName(className) {
//     const utterance = new SpeechSynthesisUtterance(className);
//     speechSynthesis.speak(utterance);
//   }

//   const drawRect = (boxes, classes, scores, threshold, imgWidth, imgHeight, ctx) => {
//     const classNames = [];

//    for(let i=0; i<=boxes.length; i++){
//         if(boxes[i] && classes[i] && scores[i]>threshold){
//             // Extract variables
//             const [y,x,height,width] = boxes[i]
//             const text = classes[i]
            
//             // Set styling
//             ctx.strokeStyle = labelMap[text]['color']
//             ctx.lineWidth = 10
//             ctx.fillStyle = 'white'
//             ctx.font = '30px Arial'         
            
//             // DRAW!!
//             ctx.beginPath()
//             ctx.fillText(labelMap[text]['name'] + ' - ' + Math.round(scores[i]*100)/100, x*imgWidth, y*imgHeight-10)
//             ctx.rect(x*imgWidth, y*imgHeight, width*imgWidth/2, height*imgHeight/1.5);
//             ctx.stroke()


//         classNames.push(labelMap[text]['name']);
//       }
//     }

//     setDetectedClassNames((prevClassNames) => [...prevClassNames, ...classNames].slice(-5));
//   };

//   const runCoco = async () => {
//     const net = await tf.loadGraphModel('https://tensorflowjsrealtimeforhack.s3.us-east.cloud-object-storage.appdomain.cloud/model.json');

//     const detect = async () => {
//       if (
//         typeof webcamRef.current !== "undefined" &&
//         webcamRef.current !== null &&
//         webcamRef.current.video.readyState === 4
//       ) {
//         const video = webcamRef.current.video;
//         const videoWidth = webcamRef.current.video.videoWidth;
//         const videoHeight = webcamRef.current.video.videoHeight;

//         webcamRef.current.video.width = videoWidth;
//         webcamRef.current.video.height = videoHeight;

//         canvasRef.current.width = videoWidth;
//         canvasRef.current.height = videoHeight;

//         const img = tf.browser.fromPixels(video);
//         const resized = tf.image.resizeBilinear(img, [640, 480]);
//         const casted = resized.cast('int32');
//         const expanded = casted.expandDims(0);
//         const obj = await net.executeAsync(expanded);

//         const boxes = await obj[1].array();
//         const classes = await obj[2].array();
//         const scores = await obj[4].array();

//         const ctx = canvasRef.current.getContext("2d");

//         requestAnimationFrame(() => {
//           drawRect(boxes[0], classes[0], scores[0], 0.8, videoWidth, videoHeight, ctx);
//         });

//         tf.dispose(img);
//         tf.dispose(resized);
//         tf.dispose(casted);
//         tf.dispose(expanded);
//         tf.dispose(obj);

//         if (isDetecting) {
//           requestAnimationFrame(detect);
//         }
//       }
//     };

//     detect();
//   };

//   const handleTranslateClick = () => {
//     setIsDetecting((prevIsDetecting) => !prevIsDetecting);

//     if (!isDetecting) {
//       setLastDetectedClass("");
//     }
//   };

//   useEffect(() => {
//     if (isDetecting) {
//       runCoco();
//     }
//   }, [isDetecting]);

//   useEffect(() => {
//     if (detectedClassNames.length > 0) {
//       const latestDetectedClass = detectedClassNames[detectedClassNames.length - 1];

//       if (latestDetectedClass !== lastDetectedClass) {
//         speakClassName(latestDetectedClass);
//         setLastDetectedClass(latestDetectedClass);

//         clearTimeout(timeoutRef.current);
//         timeoutRef.current = setTimeout(() => {
//           setLastDetectedClass("");
//         }, 5000);
//       }
//     }
//   }, [detectedClassNames, lastDetectedClass       ]);

//   return (
//     <div className="App">
//       <link
//         rel="stylesheet"
//         href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css"
//         integrity="sha384-9ndCyUaIbzAi2FUVXJi0CjmCapSmO7SnpJef0486qhLnuZ2cdeRhO02iuK6FUUVM"
//         crossorigin="anonymous"
//       />

//       <Navbar style={{ backgroundColor: '#0072DC' }}>
//         <Navbar.Brand style={{ marginLeft: '10px' }}>Sign Language to Audio</Navbar.Brand>
//       </Navbar>

//       <header className="App-header">
//         <Container>
//           <Row>
//             <Col>
//               <Card style={{ width: "50rem", borderRadius: '20px', backgroundColor: "#F4F4F4", boxShadow: '0 4px 6px rgba(0, 0, 0, 0.3)' }}>
//                 <div className="video-feed">
//                   <Webcam
//                     ref={webcamRef}
//                     muted={true}
//                     style={{
//                       position: "relative",
//                       marginLeft: "auto",
//                       marginRight: "auto",
//                       marginTop: "30px",
//                       left: 0,
//                       right: 0,
//                       textAlign: "center",
//                       zIndex: 9,
//                       width: 640,
//                       height: 480,
//                       borderRadius: 20,
//                       boxShadow: '0 4px 6px rgba(0, 0, 0, 0.9)'
//                     }}
//                   />
//                   <canvas
//                     ref={canvasRef}
//                     style={{
//                       position: "absolute",
//                       marginLeft: "auto",
//                       marginRight: "auto",
//                       left: 0,
//                       right: 0,
//                       textAlign: "center",
//                       zIndex: 8,
//                       width: 640,
//                       height: 480,
//                     }}
//                   />
//                 </div>
//                 <Card.Body  >
//                   <Card.Title>Live video feed </Card.Title>
//                   <Card.Text>
//                     Press button to start translating
//                   </Card.Text>
//                   <Button style={{ width: '200px', height: '70px' }} size="lg" block variant="primary" onClick={handleTranslateClick}>
//                     {isDetecting ? "Stop" : "Translate"}
//                   </Button>
//                 </Card.Body>
//               </Card>
//             </Col>
//             <Col className="transcription">
//               <ListGroup variant="flush">
//                 {detectedClassNames.map((className, index) => (
//                   <ListGroup.Item key={index}>{className}</ListGroup.Item>
//                 ))}
//               </ListGroup>
//             </Col>
//           </Row>
//         </Container>
//       </header>
//     </div>
//   );
// }

// export default App;
