import '@libs/orbit-control';
import './webgl/geometry-console';
import App from './webgl/core';

// load base stage
const app = new App();
const { scene, renderApp } = app;

// load scene
console.log(scene);

// start render stage
renderApp();
