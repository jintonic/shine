import * as  THREE from 'three';

import { zipSync, strToU8 } from 'three/addons/libs/fflate.module.js';

import { UIPanel, UIRow, UIHorizontalRule } from './libs/ui.js';

import { GDMLLoader } from './libs/GDMLLoader.js';

function MenubarFile( editor ) {

	const config = editor.config;
	const strings = editor.strings;

	const container = new UIPanel();
	container.setClass( 'menu' );

	const title = new UIPanel();
	title.setClass( 'title' );
	title.setTextContent( strings.getKey( 'menubar/file' ) );
	container.add( title );

	const options = new UIPanel();
	options.setClass( 'options' );
	container.add( options );

	// New

	let option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/new' ) );
	option.onClick( function () {

		if ( confirm( 'Any unsaved data will be lost. Are you sure?' ) ) {

			editor.clear();

		}

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );

	// Import

	const form = document.createElement( 'form' );
	form.style.display = 'none';
	document.body.appendChild( form );

	const fileInput = document.createElement( 'input' );
	fileInput.multiple = false;
	fileInput.type = 'file';
	fileInput.addEventListener( 'change', function () {
		let file = fileInput.files[0];
		let fileName = file.name;
		let fileExtension = fileName.split('.').pop().toLowerCase(); // Extract file extension
		let url = URL.createObjectURL(file);
		if (fileExtension === 'gdml') {
			var gdmlLoader = new GDMLLoader();
			gdmlLoader.load(url, function(objects) {
				const bbox = new THREE.Box3().setFromObject(objects);

				// Determine the size you want the model to fit in
				const desiredSize = 5; // Example: Make the longest side 5 units long
			
				// Calculate the model's current size
				const size = new THREE.Vector3();
				bbox.getSize(size);
			
				// Determine the scale factor
				const maxDimension = Math.max(size.x, size.y, size.z);
				const scaleFactor = desiredSize / maxDimension;
			
				// Scale the model
				objects.scale.set(scaleFactor, scaleFactor, scaleFactor);
				editor.scene.add( objects );
			});
			// Handle GDML file specifically
		} else {
			editor.loader.loadFiles(fileInput.files);
		}
		form.reset(); // Make sure 'form' is defined and accessible

	} );
	form.appendChild( fileInput );

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/import' ) );
	option.onClick( function () {

		fileInput.click();

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );

	// Export GT

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/geant4' ) );
	option.onClick( async function () {

		const object = editor.selected;

		console.log(object)
		var txt = `:volu world BOX 10. 10. 10. G4_AIR\n\n`;
		const rotated = object.rotation;
		const rotateX = rotated.x * 180 / Math.PI;
		const rotateY = rotated.y * 180 / Math.PI;
		const rotateZ = rotated.z * 180 / Math.PI;

		txt += `:rotm r000 ${rotateX.toFixed(2)} ${rotateY.toFixed(2)} ${rotateZ.toFixed(2)}\n\n`;

		if ( object !== null && object.isMesh != undefined ) {
			switch (object.name) {
				case "Box":

					txt += `:solid box BOX ${object.geometry.parameters.width} ${object.geometry.parameters.depth} ${object.geometry.parameters.height}\n\n`
					txt += `:volu mybox box ${object.material.name.elementType}\n\n`
					txt += `:place mybox 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'box.tg');
					break;

				case "Sphere":

					txt += `:solid mysphere SPHERE ${object.geometry.parameters.radius} ${object.geometry.parameters.phiStart} ${object.geometry.parameters.phiLength} ${object.geometry.parameters.thetaStart} ${object.geometry.parameters.thetaLength}\n\n`
					txt += `:volu mysphere mysphere ${object.material.name.elementType}\n\n`
					txt += `:place mysphere 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'sphere.tg');
					break;

				case "Tubs":
					
					txt += `:solid mytub TUBS ${object.geometry.parameters.pRMin} ${object.geometry.parameters.pRMax} ${object.geometry.parameters.pDz} ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n\n`
					txt += `:volu mytub mytub ${object.material.name.elementType}\n\n`
					txt += `:place mytub 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'tub.tg');
					break;

				case "CTubs":

					txt += `:solid mytub TUBS ${object.geometry.parameters.pRMin} ${object.geometry.parameters.pRMax} ${object.geometry.parameters.pDz} ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n\n`
					txt += `:volu mytub mytub ${object.geometry.parameters.pRMin}\n\n`
					txt += `:place mytub 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'ctub.tg');
					break;

				case "Cone":

					txt += `:solid mycone CONS ${object.geometry.parameters.pRMin1} ${object.geometry.parameters.pRMin2} ${object.geometry.parameters.pRMax1} ${object.geometry.parameters.pRMax2} ${object.geometry.parameters.pDz} ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.pDPhi}\n\n`
					txt += `:volu mycone mycone ${object.material.name.elementType}\n\n`
					txt += `:place mycone 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'cone.tg');
					break;

				case "Parallelepiped":

					txt += `:solid mypara PARA ${object.geometry.parameters.dx} ${object.geometry.parameters.dy} ${object.geometry.parameters.dz} ${object.geometry.parameters.alpha} ${object.geometry.parameters.theta} ${object.geometry.parameters.phi}\n\n`
					txt += `:volu mypara mypara ${object.material.name.elementType}\n\n`
					txt += `:place mypara 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'parallelepiped.tg');
					break;

				case "TrapeZoid":
					
					txt += `:solid mytrd TRD ${object.geometry.parameters.dx1} ${object.geometry.parameters.dx2} ${object.geometry.parameters.dy1} ${object.geometry.parameters.dy2} ${object.geometry.parameters.dz}\n\n`
					txt += `:volu mytrd mytrd ${object.material.name.elementType}\n\n`
					txt += `:place mytrd 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n\n`
					downloadGeant4File( txt, 'trapzoid.tg');
					break;

				case "aTrapeZoidP": 

					txt += `:solid mytrdp TRAP ${object.geometry.parameters.dz} ${object.geometry.parameters.theta} ${object.geometry.parameters.phi} ${object.geometry.parameters.dy1} ${object.geometry.parameters.dx1} ${object.geometry.parameters.dx2} ${object.geometry.parameters.alpha} ${object.geometry.parameters.dy2} ${object.geometry.parameters.dx3} ${object.geometry.parameters.dx4} ${object.geometry.parameters.phi}\n\n`
					txt += `:volu mytrdp mytrdp ${object.material.name.elementType}\n\n`
					txt += `:place mytrdp 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'trapezoidp.tg');
					break;

				case "aTorus":

					txt += `:solid mytorus TORUS ${object.geometry.parameters.pRMin} ${object.geometry.parameters.pRMax} ${object.geometry.parameters.pRTor} ${object.geometry.parameters.pSPhi} ${object.geometry.parameters.sDPhi}\n\n`
					txt += `:volu mytorus mytorus ${object.material.name.elementType}\n\n`
					txt += `:place mytorus 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'torus.tg');
					break;
				
				case "EllipeCylnder":

					txt += `:solid myellipT ELLIPTICAL_TUBE ${object.geometry.parameters.xSemiAxis} ${object.geometry.parameters.semiAxisY} ${object.geometry.parameters.Dz}\n\n`
					txt += `:volu myellipT myellipT ${object.manager.name.elementType}\n\n`
					txt += `:place myellipT 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'ellipeTub.tg');
					break;
				
				case "Ellipsoid":

					txt += `:solid myellipsoid ELLIPSOID ${object.geometry.parameters.xSemiAxis} ${object.geometry.parameters.ySemiAxis} ${object.geometry.parameters.zSemiAxis} ${object.geometry.parameters.zBottomCut} ${object.geometry.parameters.zTopCut}\n\n`
					txt += `:volu myellipsoid myellipsoid ${object.material.name.elementType}\n\n`
					txt += `:place myellipsoid 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'ellipsoid.tg');
					break;

				case "aEllipticalCone":

					txt += `:solid myellipticalcone ELLIPTICAL_CONE ${object.geometry.parameters.xSemiAxis} ${object.geometry.parameters.ySemiAxis} ${object.geometry.parameters.height} ${object.geometry.parameters.zTopCut}\n\n`
					txt += `:volu myellipticalcone myellipticalcone ${object.material.name.elementType}\n\n`
					txt += `:place myellipticalcone 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'ellipticalcone.tg');
					break;

				case "TwistedBox":

					txt += `:solid mytbox TWISTED_BOX ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.width} ${object.geometry.parameters.height} ${object.geometry.parameters.depth}\n\n`
					txt += `:volu mytbox mytbox ${object.material.name.elementType}\n\n`
					txt += `:place mytbox 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'twistedbox.tg');
					break;

				case "TwistedTrapeZoid":

					txt += `:solid myttrd TWISTED_TRD ${object.geometry.parameters.dx1} ${object.geometry.parameters.dx2} ${object.geometry.parameters.dy1} ${object.geometry.parameters.dy2} ${object.geometry.parameters.dz} ${object.geometry.parameters.twistedangle}\n\n`
					txt += `:volu myttrd myttrap ${object.material.name.elementType}\n\n`
					txt += `:place myttrd 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'twistedtrapzoid.tg');
					break;

				case "TwistedTrapeZoidP":

					txt += `:solid myttrap TWISTED_TRAP ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.dx1} ${object.geometry.parameters.dx2} ${object.geometry.parameters.dy1} ${object.geometry.parameters.dz} ${object.geometry.parameters.theta} ${object.geometry.parameters.dy2} ${object.geometry.parameters.dx3} ${object.geometry.parameters.dx4}\n\n`
					txt += `:volu myttrap myttrap ${object.material.name.elementType}\n\n`
					txt += `:place myttrap 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'twistedtrapezoidp.tg');
					break;

				case "TwistedTubs":

					txt += `:solid myttubs TWISTED_TUBS ${object.geometry.parameters.twistedangle} ${object.geometry.parameters.pRMin} ${object.geometry.parameters.pRMax} ${object.geometry.parameters.pDz} ${object.geometry.parameters.pDPhi}\n\n`
					txt += `:volu myttubs myttubs ${object.material.name.elementType}\n\n`
					txt += `:place myttubs 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'twistedtub.tg');
					break;

				case "Tetrahedra":

					txt += `:solid mytetra TET ${object.geometry.parameters.anchor} ${object.geometry.parameters.p2} ${object.geometry.parameters.p3} ${object.geometry.parameters.p4}\n\n`
					txt += `:volu mytetra mytetra ${object.material.name.elementType}\n\n`
					txt += `:place mytetra 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'tetrahedra.tg');
					break;

				case "Hyperboloid":

					txt += `:solid myhyperboloid HYPE ${object.geometry.parameters.radiusIn} ${object.geometry.parameters.radiusOut} ${object.geometry.parameters.stereo1} ${object.geometry.parameters.stereo2} ${object.geometry.parameters.pDz}\n\n`
					txt += `:volu myhyperboloid myhyperboloid ${object.material.name.elementType}\n\n`
					txt += `:place myhyperboloid 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'hyperboloid.tg');
					break;

				case "Polycone":

					txt += `:solid myploycone POLYCONE ${object.geometry.parameters.SPhi} ${object.geometry.parameters.DPhi} ${object.geometry.parameters.numZPlanes} ${object.geometry.parameters.z} ${object.geometry.parameters.rOuter}\n\n`
					txt += `:volu myploycone mypolycone ${object.material.name.elementType}\n\n`
					txt += `:place mypolycone 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'polycone.tg');
					break;

				case "Polyhedra":
					
					txt += `:solid mypolyhedra POLYHEDRA ${object.geometry.parameters.SPhi} ${object.geometry.parameters.DPhi} ${object.geometry.parameters.numSide} ${object.geometry.parameters.numZPlanes} ${object.geometry.parameters.z} ${object.geometry.parameters.rOuter}\n\n`
					txt += `:volu mypolyhedra mypolyhedra ${object.material.name.elementType}\n\n`
					txt += `:place mypolyhedra 1 world r000 ${object.position.x.toFixed(2)} ${object.position.y.toFixed(2)} ${object.position.z.toFixed(2)}\n`
					downloadGeant4File( txt, 'polyhedra.tg');
					break;

				default:

					break;
			}
		} else {
			alert( 'The added model could not be found.');
		}

		// TODO: Change to DRACOExporter's parse( geometry, onParse )?
		

	} );
	options.add( option );

	// Export GT Scene

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/geant4_scene' ) );
	option.onClick( async function () {

		const modelCount = editor.scene.children.length;
		
		var solidText = ''
		var voluText ='';
		var placeText = '';
		var rotationText = '';

		if(modelCount > 0) {
			for (let i=0; i<modelCount; i++) {
				//:solid base TUBS 5*cm 14*cm 5*cm 0 360
				const children = editor.scene.children[i];

				switch (children.name) {
					case "Box":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`											
						solidText += `:solid ${children.name}-solid-${i+1} BOX ${children.geometry.parameters.width} ${children.geometry.parameters.depth} ${children.geometry.parameters.height}\n`
						break;
	
					case "Sphere":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} SPHERE ${children.geometry.parameters.radius} ${children.geometry.parameters.phiStart} ${children.geometry.parameters.phiLength} ${children.geometry.parameters.thetaStart} ${children.geometry.parameters.thetaLength}\n`
						break;
	
					case "Tubs":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`											
						solidText += `:solid ${children.name}-solid-${i+1} TUBS ${children.geometry.parameters.pRMin} ${children.geometry.parameters.pRMax} ${children.geometry.parameters.pDz} ${children.geometry.parameters.pSPhi} ${children.geometry.parameters.pDPhi}\n`
						break;
	
					case "CTubs":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} TUBS ${children.geometry.parameters.pRMin} ${children.geometry.parameters.pRMax} ${children.geometry.parameters.pDz} ${children.geometry.parameters.pSPhi} ${children.geometry.parameters.pDPhi}\n`
						break;
	
					case "Cone":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} CONS ${children.geometry.parameters.pRMin1} ${children.geometry.parameters.pRMin2} ${children.geometry.parameters.pRMax1} ${children.geometry.parameters.pRMax2} ${children.geometry.parameters.pDz} ${children.geometry.parameters.pSPhi} ${children.geometry.parameters.pDPhi}\n`
						break;
	
					case "Parallelepiped":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} PARA ${children.geometry.parameters.dx} ${children.geometry.parameters.dy} ${children.geometry.parameters.dz} ${children.geometry.parameters.alpha} ${children.geometry.parameters.theta} ${children.geometry.parameters.phi}\n`
						break;
	
					case "TrapeZoid":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`											
						solidText += `:solid ${children.name}-solid-${i+1} TRD ${children.geometry.parameters.dx1} ${children.geometry.parameters.dx2} ${children.geometry.parameters.dy1} ${children.geometry.parameters.dy2} ${children.geometry.parameters.dz}\n`
						break;
	
					case "aTrapeZoidP": 
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} TRAP ${children.geometry.parameters.dz} ${children.geometry.parameters.theta} ${children.geometry.parameters.phi} ${children.geometry.parameters.dy1} ${children.geometry.parameters.dx1} ${children.geometry.parameters.dx2} ${children.geometry.parameters.alpha} ${children.geometry.parameters.dy2} ${children.geometry.parameters.dx3} ${children.geometry.parameters.dx4} ${children.geometry.parameters.phi}\n`
						break;
	
					case "aTorus":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} TORUS ${children.geometry.parameters.pRMin} ${children.geometry.parameters.pRMax} ${children.geometry.parameters.pRTor} ${children.geometry.parameters.pSPhi} ${children.geometry.parameters.sDPhi}\n`
						break;
					
					case "EllipeCylnder":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} ELLIPTICAL_TUBE ${children.geometry.parameters.xSemiAxis} ${children.geometry.parameters.semiAxisY} ${children.geometry.parameters.Dz}\n`
						break;
					
					case "Ellipsoid":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} ELLIPSOID ${children.geometry.parameters.xSemiAxis} ${children.geometry.parameters.ySemiAxis} ${children.geometry.parameters.zSemiAxis} ${children.geometry.parameters.zBottomCut} ${children.geometry.parameters.zTopCut}\n`
						break;
	
					case "aEllipticalCone":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} ELLIPTICAL_CONE ${children.geometry.parameters.xSemiAxis} ${children.geometry.parameters.ySemiAxis} ${children.geometry.parameters.height} ${children.geometry.parameters.zTopCut}\n`
						break;
	
					case "TwistedBox":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} TWISTED_BOX ${children.geometry.parameters.twistedangle} ${children.geometry.parameters.width} ${children.geometry.parameters.height} ${children.geometry.parameters.depth}\n`
						break;
	
					case "TwistedTrapeZoid":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} TWISTED_TRD ${children.geometry.parameters.dx1} ${children.geometry.parameters.dx2} ${children.geometry.parameters.dy1} ${children.geometry.parameters.dy2} ${children.geometry.parameters.dz} ${children.geometry.parameters.twistedangle}\n`
						break;
	
					case "TwistedTrapeZoidP":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} TWISTED_TRAP ${children.geometry.parameters.twistedangle} ${children.geometry.parameters.dx1} ${children.geometry.parameters.dx2} ${children.geometry.parameters.dy1} ${children.geometry.parameters.dz} ${children.geometry.parameters.theta} ${children.geometry.parameters.dy2} ${children.geometry.parameters.dx3} ${children.geometry.parameters.dx4}\n`
						break;
	
					case "TwistedTubs":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} TWISTED_TUBS ${children.geometry.parameters.twistedangle} ${children.geometry.parameters.pRMin} ${children.geometry.parameters.pRMax} ${children.geometry.parameters.pDz} ${children.geometry.parameters.pDPhi}\n`
						break;
	
					case "Tetrahedra":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} TET ${children.geometry.parameters.anchor} ${children.geometry.parameters.p2} ${children.geometry.parameters.p3} ${children.geometry.parameters.p4}\n`
						break;
	
					case "Hyperboloid":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} HYPE ${children.geometry.parameters.radiusIn} ${children.geometry.parameters.radiusOut} ${children.geometry.parameters.stereo1} ${children.geometry.parameters.stereo2} ${children.geometry.parameters.pDz}\n`
						break;
	
					case "Polycone":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`									
						solidText += `:solid ${children.name}-solid-${i+1} POLYCONE ${children.geometry.parameters.SPhi} ${children.geometry.parameters.DPhi} ${children.geometry.parameters.numZPlanes} ${children.geometry.parameters.z} ${children.geometry.parameters.rOuter}\n`
						break;
	
					case "Polyhedra":
						rotationText += `:rotm rot${i+1} ${children.rotation.x} ${children.rotation.y} ${children.rotation.z}\n`											
						solidText += `:solid ${children.name}-solid-${i+1} POLYHEDRA ${children.geometry.parameters.SPhi} ${children.geometry.parameters.DPhi} ${children.geometry.parameters.numSide} ${children.geometry.parameters.numZPlanes} ${children.geometry.parameters.z} ${children.geometry.parameters.rOuter}\n`
						break;
	
					default:
	
						break;
				}
				//:volu gear1 bas5 G4_STAINLESS-STEEL
				voluText += `:volu ${children.name}-volu-${i+1} ${children.name}-solid-${i+1} ${children.material.name.elementType}\n`

				//:place gear1 1 world r000 -2*cm -8*cm 0
				placeText += `:place ${children.name}-volu-${i+1} ${i+1} world rot${i+1} ${children.position.x} ${children.position.y} ${children.position.z}\n`

			
				//:vis world OFF
			}

			var sceneText = `:volu world BOX 10 10 10 G4_AIR\n\n`;

			sceneText += `:rotm r000 0 0 0\n`;
			sceneText += `${rotationText}\n`;

			sceneText += `${solidText}\n`;

			sceneText += `${voluText}\n`;

			sceneText += `${placeText}`;
			sceneText += `:vis world OFF`;

			downloadGeant4File(sceneText, 'scene.tg')
		} else {
			alert( 'The added model could not be found.');
		}

	} );
	options.add( option );

	// Export GDML
	
	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/gdml' ) );
	option.onClick( async function () {

		const object = editor.selected;
		
		const rotated = object.rotation;
		const rotateX = rotated.x * 180 / Math.PI;
		const rotateY = rotated.y * 180 / Math.PI;
		const rotateZ = rotated.z * 180 / Math.PI;

		const roomSize = 10;

		switch (object.name) {
			case "Box":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <box name="boxSolid" x="${object.geometry.parameters.width}" y="${object.geometry.parameters.depth}" z="${object.geometry.parameters.height}" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="boxVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="boxVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="boxSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'box.gdml')

				break;
		
			case "Sphere":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <sphere name="sphereSolid" rmin="${0}" rmax="${object.geometry.parameters.radius}" deltaphi="${object.geometry.parameters.phiLength}" deltatheta="${object.geometry.parameters.thetaLength}" aunit="rad" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="sphereVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="sphereVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="sphereSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'spehre.gdml')
				break;
	
			case "Tubs":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <tube name="tubeSolid" rmin="${object.geometry.parameters.pRMin}" rmax="${object.geometry.parameters.pRMax}" z="${object.geometry.parameters.pDz}" deltaphi="${object.geometry.parameters.pDPhi}" startphi="${object.geometry.parameters.pSPhi}" aunit="rad" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="sphereVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="sphereVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="tubeSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'Tube.gdml')
				break;
						
			case "CTubs":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <cutTube name="CtubeSolid" rmin="${object.geometry.parameters.pRMin}" rmax="${object.geometry.parameters.pRMax}" z="${object.geometry.parameters.pDz}" deltaphi="${object.geometry.parameters.pDPhi}" startphi="${object.geometry.parameters.pSPhi}" lowX="${object.geometry.parameters.pLowNorm.x} lowY="${object.geometry.parameters.pLowNorm.y}" lowZ="${object.geometry.parameters.pLowNorm.z}" highX="${object.geometry.parameters.pHighNorm.x}" highY="${object.geometry.parameters.pHighNorm.y}" highZ="${object.geometry.parameters.pHighNorm.z}" aunit="rad" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="CtubVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="CtubVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="CtubeSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'Ctube.gdml')
				break;
											
			case "Cone":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <cone name="coneSolid" rmin1="${object.geometry.parameters.pRMin1}" rmin2="${object.geometry.parameters.pRMin2}" rmax1="${object.geometry.parameters.pRMax1}" rmax2="${object.geometry.parameters.pRMax2}" z="${object.geometry.parameters.pDz}" deltaphi="${object.geometry.parameters.pDPhi}" startphi="${object.geometry.parameters.pSPhi}" lowX="${object.geometry.parameters.pLowNorm.x} lowY="${object.geometry.parameters.pLowNorm.y}" lowZ="${object.geometry.parameters.pLowNorm.z}" highX="${object.geometry.parameters.pHighNorm.x}" highY="${object.geometry.parameters.pHighNorm.y}" highZ="${object.geometry.parameters.pHighNorm.z}" aunit="rad" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="coneVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="coneVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="coneSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'Cone.gdml')
				break;
																
			case "Parallelepiped":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <para name="paraSolid" x="${object.geometry.parameters.dx}" y="${object.geometry.parameters.dy}" z="${object.geometry.parameters.dz}" alpha="${object.geometry.parameters.alpha}" theta="${object.geometry.parameters.theta}" phi="${object.geometry.parameters.phi}" aunit="rad" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="paraVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="paraVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="paraSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'Parallelepiped.gdml')
				break;
																					
			case "TrapeZoid":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <trd name="trdSolid" x1="${object.geometry.parameters.dx1}" x2="${object.geometry.parameters.dx2}" y1="${object.geometry.parameters.dy1}" y2="${object.geometry.parameters.dy2}" z="${object.geometry.parameters.dz}" alpha="${object.geometry.parameters.alpha}" theta="${object.geometry.parameters.theta}" phi="${object.geometry.parameters.phi}" aunit="rad" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="trdVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="trdVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="trdSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'Trapezoid.gdml')
				break;
																										
			case "aTrapeZoidP":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <trap name="trapSolid" x1="${object.geometry.parameters.dx1}" x2="${object.geometry.parameters.dx2}" x3="${object.geometry.parameters.dx3}" x4="${object.geometry.parameters.dx4}" y1="${object.geometry.parameters.dy1}" y2="${object.geometry.parameters.dy2}" z="${object.geometry.parameters.dz}" alpha="${object.geometry.parameters.alpha}" theta="${object.geometry.parameters.theta}" phi="${object.geometry.parameters.phi}" aunit="rad" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="trapVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="trapVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="trapSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'Trapezoid.gdml')
				break;
																									
			case "aTorus":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <torus name="torusSolid" rmin="${object.geometry.parameters.pRMin}" rmax="${object.geometry.parameters.pRMax}" rtor="${object.geometry.parameters.pRTor}" starttheta="${object.geometry.parameters.pSPhi}" deltatheta="${object.geometry.parameters.pDPhi}" aunit="rad" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="torusVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="torusVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="torusSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'Torus.gdml')
				break;
																															
			case "EllipeCylnder":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <eltube name="ellipetubeSolid" dx="${object.geometry.parameters.xSemiAxis}" dy="${object.geometry.parameters.semiAxisY}" dz="${object.geometry.parameters.Dz}" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="elliptubeVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="elliptubeVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="ellipetubeSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'EllipeTube.gdml')
				break;
																																					
			case "Ellipsoid":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <ellipsoid name="ellipsoidSolid" ax="${object.geometry.parameters.xSemiAxis}" by="${object.geometry.parameters.semiAxisY}" cz="${object.geometry.parameters.zSemiAxis}" zcut2="${object.geometry.parameters.zBottomCut}" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="ellipsoidVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="ellipsoidVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="ellipsoidSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'Ellipsoid.gdml')
				break;
																																											
			case "aEllipticalCone":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <elcone name="elconeSolid" dx="${object.geometry.parameters.xSemiAxis}" dy="${object.geometry.parameters.ySemiAxis}" zmax="${object.geometry.parameters.height}" zcut="${object.geometry.parameters.zTopCut}" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="elconeVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="elconeVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="elconeSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'EllipticalCone.gdml')
				break;
																																															
			case "TwistedBox":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <twistedbox name="tboxSolid" PhiTwist="${object.geometry.parameters.twistedangle}" x="${object.geometry.parameters.width}" y="${object.geometry.parameters.height}" z="${object.geometry.parameters.depth}" aunit="rad" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="tboxVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="tboxVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="tboxSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'TwistedBox.gdml')
				break;
																																																			
			case "TwistedTrapeZoid":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <twistedtrd name="ttradSolid" PhiTwist="${object.geometry.parameters.twistedangle}" x1="${object.geometry.parameters.dx1}" x2="${object.geometry.parameters.dx2}" y1="${object.geometry.parameters.dy1}" y2="${object.geometry.parameters.dy2}" z="${object.geometry.parameters.dz}" aunit="rad" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="ttradVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="ttradVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="ttradSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'TwistedTrapeZoid.gdml')
				break;
																																																							
			case "TwistedTrapeZoidP":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <twistedtrap name="ttrapSolid" PhiTwist="${object.geometry.parameters.twistedangle}" x1="${object.geometry.parameters.dx1}" x2="${object.geometry.parameters.dx2}" y1="${object.geometry.parameters.dy1}" y2="${object.geometry.parameters.dy2}" z="${object.geometry.parameters.dz}" x3="${object.geometry.parameters.dx3}" x4="${object.geometry.parameters.dx4}" Alph="${object.geometry.parameters.alpha}" Theta="${object.geometry.parameters.theta}" aunit="rad" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="ttrapVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="ttrapVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="ttrapSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'TwistedTrapeZoidP.gdml')
				break;
																																																											
			case "TwistedTubs":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <twistedtubs name="ttubeSolid" twistedangle="${object.geometry.parameters.twistedangle}" endinnerrad="${object.geometry.parameters.pRMin}" endouterrad="${object.geometry.parameters.pRMax}" zlen="${object.geometry.parameters.pDz}" phi="${object.geometry.parameters.pDPhi}" aunit="rad" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="ttubeVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="ttubeVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="ttubeSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'TwistedTubs.gdml')
				break;
																																																															
			case "Tetrahedra":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <tet name="tetraSolid" vertex1="${object.geometry.parameters.anchor}" vertex2="${object.geometry.parameters.p2}" vertex3="${object.geometry.parameters.p3}" vertex4="${object.geometry.parameters.p4}"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="tetraVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="tetraVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="tetraSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'Tetrahedra.gdml')
				break;
																																																														
			case "Hyperboloid":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <hype name="hypeSolid" rmin="${object.geometry.parameters.radiusIn}" rmax="${object.geometry.parameters.radiusOut}" z="${object.geometry.parameters.pDz}" inst="${object.geometry.parameters.stereo1}" outst="${object.geometry.parameters.stereo2}" lunit="m"/>\n`; // Adjust size as needed
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="hypeVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="hypeVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="hypeSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'Hyperboloid.gdml')
				break;
																																																													
			case "Polycone":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <polycone name="polyconeSolid" startphi="${object.geometry.parameters.SPhi}" deltaphi="${object.geometry.parameters.DPhi}" aunit="rad" lunit="m">\n`; // Adjust size as needed

				for(var i = 0; i < object.geometry.parameters.numZPlanes; i++){
					gdml += `        <zplane rmin="${object.geometry.parameters.rInner[i]}" rmax="${object.geometry.parameters.rOuter[i]}" z="${object.geometry.parameters.z[i]}"/>\n`
				}

				gdml += `      </polycone>\n`;
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="polyconeVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="polyconeVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="polyconeSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'Polycone.gdml')
				break;
																																																																		
			case "Polyhedra":
				var gdml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
				gdml += `<gdml xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance" xsi:noNamespaceSchemaLocation="http://gdml.web.cern.ch/GDML/schema/gdml.xsd">\n`;
				gdml += `  <define>\n`;
				gdml += `    <materials>\n`;
				gdml += `      <material name="Air" state="gas">\n`;
				gdml += `        <D value="0.001205" unit="g/cm3"/>\n`;
				gdml += `        <composite n="1">\n`;
				gdml += `          <fraction ref="N" n="0.7"/>\n`;
				gdml += `          <fraction ref="O" n="0.3"/>\n`;
				gdml += `        </composite>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `      <material name="${object.material?.name?.elementType}">\n`;
				gdml += `        <D value="${object.material?.name?.density}" unit="g/cm3"/>\n`;
				gdml += `        <T value="293.15" unit="K"/>\n`;
				gdml += `      </material>\n`;
				gdml += `    </materials>\n`;
				gdml += `    <solids>\n`;
				gdml += `      <box name="roomSolid" x="${roomSize}" y="${roomSize}" z="${roomSize}" lunit="m"/>\n`;
				gdml += `      <polyhedra name="polyhedraSolid" startphi="${object.geometry.parameters.SPhi}" deltaphi="${object.geometry.parameters.DPhi}" numsides="${object.geometry.parameters.numSide}" aunit="rad" lunit="m">\n`; // Adjust size as needed

				for(var i = 0; i < object.geometry.parameters.numZPlanes; i++){
					gdml += `        <zplane rmin="${object.geometry.parameters.rInner[i]}" rmax="${object.geometry.parameters.rOuter[i]}" z="${object.geometry.parameters.z[i]}"/>\n`
				}

				gdml += `      </polyhedra>\n`;
				gdml += `    </solids>\n`;
				gdml += `  </define>\n`;
				gdml += `  <structure>\n`;
				gdml += `    <volume name="world">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `      <physvol>\n`;
				gdml += `        <volumeref ref="polyhedraVolume"/>\n`;
				gdml += `        <position name="pos" unit="m" x="${object.position.x.toFixed(4)}" y="${object.position.y.toFixed(4)}" z="${object.position.z.toFixed(4)}"/>\n`; // Adjust position as needed
				gdml += `        <rotation name="rot" unit="deg" x="${rotateX.toFixed(2)}" y="${rotateY.toFixed(2)}" z="${rotateZ.toFixed(2)}"/>\n`; // Adjust rotation as needed
				gdml += `      </physvol>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="roomVolume">\n`;
				gdml += `      <materialref ref="Air"/>\n`;
				gdml += `      <solidref ref="roomSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `    <volume name="polyhedraVolume">\n`;
				gdml += `      <materialref ref="${object.material.name?.elementType}"/>\n`;
				gdml += `      <solidref ref="polyhedraSolid"/>\n`;
				gdml += `    </volume>\n`;
				gdml += `  </structure>\n`;
				gdml += `  <setup>\n`;
				gdml += `    <world ref="world"/>\n`;
				gdml += `  </setup>\n`;
				gdml += `</gdml>\n`;
				
				downloadGeant4File( gdml, 'Polyhedra.gdml')
				break;
				
			default:
				break;
		}
		

	} );
	options.add( option );

	// Export GDML scene
	
	// option = new UIRow();
	// option.setClass( 'option' );
	// option.setTextContent( strings.getKey( 'menubar/file/export/gdml_scene' ) );
	// option.onClick( async function () {

	// 	const roomSize = 10;
	// 	var sceneText = '';
	// 	var materialsText = '';
	// 	var solidsText = '';
	// 	var 

	// } );
	// options.add( option );
		

	// Export Macro
	
	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/mac' ) );
	option.onClick( async function () {

		var object = null;
		editor.scene.traverse( function ( node ) {
			if(node.name === 'RadiationSource'){
				object = node;
			}
		})
		
		// const object = editor.selected;

		if(object) {
			const position = object.position
			var sourceShape;
	
			switch (object.source) {
				case 'Point':
					
					sourceShape = null;
					break;
	
				case "Plane":
	
					sourceShape = object.planeshape;
					break;
	
				case "Beam":
	
					sourceShape = null;
					break;
	
				case "Surface":
	
					sourceShape = object.volumeshape;
					break;
	
				case "Volume":
	
					sourceShape = object.volumeshape;
					break;
	
				default:
					break;
			}
	
			let macro = `# Macro test2.g4mac`;
			macro += `/gps/particle ${object.energykind}\n`
			macro += `/gps/energy ${object.energysize}\n`
			macro += `/gps/pos/centre ${position.x} ${position.y} ${position.z} m\n`
			macro += `/gps/pos/type ${object.source}\n`
			if(sourceShape) macro += `/gps/pos/shape ${sourceShape}\n`
			macro += `/gps/pos/halfx ${object.halfX}\n`
			macro += `/gps/pos/halfy ${object.halfY}\n`
			macro += `/gps/pos/halfz ${object.halfZ}\n`
			macro += `/gps/pos/inner_radius ${object.innerradius}\n`
			macro += `/gps/pos/outer_radius ${object.outerradius}\n`
	
			downloadGeant4File( macro, 'box.mac')
	
		} else {
			alert( 'The added source could not be found.');
		}
		
	} );
	options.add( option );


	// Export Geometry	

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/geometry' ) );
	option.onClick( function () {

		const object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		const geometry = object.geometry;

		if ( geometry === undefined ) {

			alert( 'The selected object doesn\'t have geometry.' );
			return;

		}

		let output = geometry.toJSON();

		try {

			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'geometry.json' );

	} );
	options.add( option );

	// Export Object

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/object' ) );
	option.onClick( function () {

		const object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected' );
			return;

		}

		let output = object.toJSON();

		try {

			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'model.json' );

	} );
	options.add( option );

	// Export Scene

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/scene' ) );
	option.onClick( function () {

		let output = editor.scene.toJSON();

		try {

			output = JSON.stringify( output, null, '\t' );
			output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		} catch ( e ) {

			output = JSON.stringify( output );

		}

		saveString( output, 'scene.json' );

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );

	// Export DRC

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/drc' ) );
	option.onClick( async function () {

		const object = editor.selected;

		if ( object === null || object.isMesh === undefined ) {

			alert( 'No mesh selected' );
			return;

		}

		const { DRACOExporter } = await import( 'three/addons/exporters/DRACOExporter.js' );

		const exporter = new DRACOExporter();

		const options = {
			decodeSpeed: 5,
			encodeSpeed: 5,
			encoderMethod: DRACOExporter.MESH_EDGEBREAKER_ENCODING,
			quantization: [ 16, 8, 8, 8, 8 ],
			exportUvs: true,
			exportNormals: true,
			exportColor: object.geometry.hasAttribute( 'color' )
		};

		// TODO: Change to DRACOExporter's parse( geometry, onParse )?
		const result = exporter.parse( object, options );
		saveArrayBuffer( result, 'model.drc' );

	} );
	options.add( option );

	// Export GLB

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/glb' ) );
	option.onClick( async function () {

		const scene = editor.scene;
		const animations = getAnimations( scene );

		const { GLTFExporter } = await import( 'three/addons/exporters/GLTFExporter.js' );

		const exporter = new GLTFExporter();

		exporter.parse( scene, function ( result ) {

			saveArrayBuffer( result, 'scene.glb' );

		}, undefined, { binary: true, animations: animations } );

	} );
	options.add( option );

	// Export GLTF

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/gltf' ) );
	option.onClick( async function () {

		const scene = editor.scene;
		const animations = getAnimations( scene );

		const { GLTFExporter } = await import( 'three/addons/exporters/GLTFExporter.js' );

		const exporter = new GLTFExporter();

		exporter.parse( scene, function ( result ) {

			saveString( JSON.stringify( result, null, 2 ), 'scene.gltf' );

		}, undefined, { animations: animations } );


	} );
	options.add( option );

	// Export OBJ

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/obj' ) );
	option.onClick( async function () {

		const object = editor.selected;

		if ( object === null ) {

			alert( 'No object selected.' );
			return;

		}

		const { OBJExporter } = await import( 'three/addons/exporters/OBJExporter.js' );

		const exporter = new OBJExporter();

		saveString( exporter.parse( object ), 'model.obj' );

	} );
	options.add( option );

	// Export PLY (ASCII)

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/ply' ) );
	option.onClick( async function () {

		const { PLYExporter } = await import( 'three/addons/exporters/PLYExporter.js' );

		const exporter = new PLYExporter();

		exporter.parse( editor.scene, function ( result ) {

			saveArrayBuffer( result, 'model.ply' );

		} );

	} );
	options.add( option );

	// Export PLY (Binary)

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/ply_binary' ) );
	option.onClick( async function () {

		const { PLYExporter } = await import( 'three/addons/exporters/PLYExporter.js' );

		const exporter = new PLYExporter();

		exporter.parse( editor.scene, function ( result ) {

			saveArrayBuffer( result, 'model-binary.ply' );

		}, { binary: true } );

	} );
	options.add( option );

	// Export STL (ASCII)

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/stl' ) );
	option.onClick( async function () {

		const { STLExporter } = await import( 'three/addons/exporters/STLExporter.js' );

		const exporter = new STLExporter();

		saveString( exporter.parse( editor.scene ), 'model.stl' );

	} );
	options.add( option );

	// Export STL (Binary)

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/stl_binary' ) );
	option.onClick( async function () {

		const { STLExporter } = await import( 'three/addons/exporters/STLExporter.js' );

		const exporter = new STLExporter();

		saveArrayBuffer( exporter.parse( editor.scene, { binary: true } ), 'model-binary.stl' );

	} );
	options.add( option );

	// Export USDZ

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/export/usdz' ) );
	option.onClick( async function () {

		const { USDZExporter } = await import( 'three/addons/exporters/USDZExporter.js' );

		const exporter = new USDZExporter();

		saveArrayBuffer( await exporter.parse( editor.scene ), 'model.usdz' );

	} );
	options.add( option );

	//

	options.add( new UIHorizontalRule() );

	// Publish

	option = new UIRow();
	option.setClass( 'option' );
	option.setTextContent( strings.getKey( 'menubar/file/publish' ) );
	option.onClick( function () {

		const toZip = {};

		//

		let output = editor.toJSON();
		output.metadata.type = 'App';
		delete output.history;

		output = JSON.stringify( output, null, '\t' );
		output = output.replace( /[\n\t]+([\d\.e\-\[\]]+)/g, '$1' );

		toZip[ 'app.json' ] = strToU8( output );

		//

		const title = config.getKey( 'project/title' );

		const manager = new  THREE.LoadingManager( function () {

			const zipped = zipSync( toZip, { level: 9 } );

			const blob = new Blob( [ zipped.buffer ], { type: 'application/zip' } );

			save( blob, ( title !== '' ? title : 'untitled' ) + '.zip' );

		} );

		const loader = new  THREE.FileLoader( manager );
		loader.load( 'js/libs/app/index.html', function ( content ) {

			content = content.replace( '<!-- title -->', title );

			const includes = [];

			content = content.replace( '<!-- includes -->', includes.join( '\n\t\t' ) );

			let editButton = '';

			if ( config.getKey( 'project/editable' ) ) {

				editButton = [
					'			let button = document.createElement( \'a\' );',
					'			button.href = \'https://threejs.org/editor/#file=\' + location.href.split( \'/\' ).slice( 0, - 1 ).join( \'/\' ) + \'/app.json\';',
					'			button.style.cssText = \'position: absolute; bottom: 20px; right: 20px; padding: 10px 16px; color: #fff; border: 1px solid #fff; border-radius: 20px; text-decoration: none;\';',
					'			button.target = \'_blank\';',
					'			button.textContent = \'EDIT\';',
					'			document.body.appendChild( button );',
				].join( '\n' );

			}

			content = content.replace( '\t\t\t/* edit button */', editButton );

			toZip[ 'index.html' ] = strToU8( content );

		} );
		loader.load( 'js/libs/app.js', function ( content ) {

			toZip[ 'js/app.js' ] = strToU8( content );

		} );
		loader.load( '../build/three.module.js', function ( content ) {

			toZip[ 'js/three.module.js' ] = strToU8( content );

		} );
		loader.load( '../examples/jsm/webxr/VRButton.js', function ( content ) {

			toZip[ 'js/VRButton.js' ] = strToU8( content );

		} );

	} );
	options.add( option );

	//

	const link = document.createElement( 'a' );
	function save( blob, filename ) {

		if ( link.href ) {

			URL.revokeObjectURL( link.href );

		}

		link.href = URL.createObjectURL( blob );
		link.download = filename || 'data.json';
		link.dispatchEvent( new MouseEvent( 'click' ) );

	}

	function saveArrayBuffer( buffer, filename ) {

		save( new Blob( [ buffer ], { type: 'application/octet-stream' } ), filename );

	}

	function downloadGeant4File(text, filename) {
		const blob = new Blob([text], { type: 'text/plain' });
		const url = URL.createObjectURL(blob);
		
		const a = document.createElement('a');
		a.href = url;
		a.download = filename;
		a.click();
	
		URL.revokeObjectURL(url); // release the Blob URL
	}

	function saveString( text, filename ) {

		save( new Blob( [ text ], { type: 'text/plain' } ), filename );

	}

	function getAnimations( scene ) {

		const animations = [];

		scene.traverse( function ( object ) {

			animations.push( ... object.animations );

		} );

		return animations;

	}

	return container;

}

export { MenubarFile };
