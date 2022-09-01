# RayJS
A fun little implementation of an old-school ray casting engine using HTML5 and Javascript. Originally created in 2014, this version is a 2022 refresh with a number of bug and performance fixes.

![Preview of project in action.](https://raw.githubusercontent.com/aussieboosh/RayJS/main/imgs/preview.png)

# Copyright / License
Creative Commons Attribution-ShareAlike 4.0 International (CC BY-SA 4.0)

# Live Demo
A live demonstration of this code is available on my website:

[http://matthewlynch.net/projects/rayjs/](http://matthewlynch.net/projects/rayjs/)

# Technical Details
Tested in Chrome 104.0.5112, Edge 104.0.1293, and Firefox 104.0.1.

As the performance of direct pixel manipulation remains poor in Canvas2D, this implementation uses drawImage() for textures and therefore (like Wolfenstein 3D) is limited to textured walls only.