const cacheName = 'Shine';

const assets = [
  '/',

  '/css/main.css',

  '/manifest.json',

  '/images/icon.png',
  '/images/favicon.ico',
  '/images/rotate.svg',
  '/images/scale.svg',
  '/images/translate.svg',
  '/images/exclude.svg',
  '/images/favicon_white.ico',
  '/images/merge.svg',
  '/images/rotate.svg',
  '/images/scale.svg',
  '/images/subtract.svg',
  '/images/translate.svg',
  '/images/basicmodels/aBox.jpg',
  '/images/basicmodels/aBREPSolidPCone.jpg',
  '/images/basicmodels/aBREPSolidPolyhedra.jpg',
  '/images/basicmodels/aCons.jpg',
  '/images/basicmodels/aCutTube.jpg',
  '/images/basicmodels/aEllipsoid.jpg',
  '/images/basicmodels/aEllipticalCone.jpg',
  '/images/basicmodels/aEllipticalTube.jpg',
  '/images/basicmodels/aGenericTrap.jpg',
  '/images/basicmodels/aHyperboloid.jpg',
  '/images/basicmodels/aOrb.jpg',
  '/images/basicmodels/aPara.jpg',
  '/images/basicmodels/aParaboloid.jpg',
  '/images/basicmodels/aSphere.jpg',
  '/images/basicmodels/aTet.jpg',
  '/images/basicmodels/aTorus.jpg',
  '/images/basicmodels/aTrap.jpg',
  '/images/basicmodels/aTrd.jpg',
  '/images/basicmodels/aTubs.jpg',
  '/images/basicmodels/aTwistedBox.jpg',
  '/images/basicmodels/aTwistedTrap.jpg',
  '/images/basicmodels/aTwistedTrd.jpg',
  '/images/basicmodels/aTwistedTubs.jpg',

  'three.module.js',

  'three/examples/jsm/controls/TransformControls.js',

  'three/examples/jsm/libs/chevrotain.module.min.js',
  'three/examples/jsm/libs/fflate.module.js',

  'three/examples/jsm/libs/draco/draco_decoder.js',
  'three/examples/jsm/libs/draco/draco_decoder.wasm',
  'three/examples/jsm/libs/draco/draco_encoder.js',
  'three/examples/jsm/libs/draco/draco_wasm_wrapper.js',

  'three/examples/jsm/libs/draco/gltf/draco_decoder.js',
  'three/examples/jsm/libs/draco/gltf/draco_decoder.wasm',
  'three/examples/jsm/libs/draco/gltf/draco_wasm_wrapper.js',

  'three/examples/jsm/libs/meshopt_decoder.module.js',

  'three/examples/jsm/libs/motion-controllers.module.js',

  'three/examples/jsm/libs/rhino3dm/rhino3dm.wasm',
  'three/examples/jsm/libs/rhino3dm/rhino3dm.js',

  'three/examples/jsm/loaders/3DMLoader.js',
  'three/examples/jsm/loaders/3MFLoader.js',
  'three/examples/jsm/loaders/AMFLoader.js',
  'three/examples/jsm/loaders/ColladaLoader.js',
  'three/examples/jsm/loaders/DRACOLoader.js',
  'three/examples/jsm/loaders/FBXLoader.js',
  'three/examples/jsm/loaders/GLTFLoader.js',
  'three/examples/jsm/loaders/KMZLoader.js',
  'three/examples/jsm/loaders/KTX2Loader.js',
  'three/examples/jsm/loaders/MD2Loader.js',
  'three/examples/jsm/loaders/MTLLoader.js',
  'three/examples/jsm/loaders/OBJLoader.js',
  'three/examples/jsm/loaders/PCDLoader.js',
  'three/examples/jsm/loaders/PLYLoader.js',
  'three/examples/jsm/loaders/RGBELoader.js',
  'three/examples/jsm/loaders/STLLoader.js',
  'three/examples/jsm/loaders/SVGLoader.js',
  'three/examples/jsm/loaders/TDSLoader.js',
  'three/examples/jsm/loaders/TGALoader.js',
  'three/examples/jsm/loaders/USDZLoader.js',
  'three/examples/jsm/loaders/VOXLoader.js',
  'three/examples/jsm/loaders/VRMLLoader.js',
  'three/examples/jsm/loaders/VTKLoader.js',
  'three/examples/jsm/loaders/XYZLoader.js',

  'three/examples/jsm/curves/NURBSCurve.js',
  'three/examples/jsm/curves/NURBSUtils.js',

  'three/examples/jsm/interactive/HTMLMesh.js',
  'three/examples/jsm/interactive/InteractiveGroup.js',

  'three/examples/jsm/environments/RoomEnvironment.js',

  'three/examples/jsm/exporters/DRACOExporter.js',
  'three/examples/jsm/exporters/GLTFExporter.js',
  'three/examples/jsm/exporters/OBJExporter.js',
  'three/examples/jsm/exporters/PLYExporter.js',
  'three/examples/jsm/exporters/STLExporter.js',
  'three/examples/jsm/exporters/USDZExporter.js',

  'three/examples/jsm/helpers/VertexNormalsHelper.js',

  'three/examples/jsm/webxr/VRButton.js',
  'three/examples/jsm/webxr/XRControllerModelFactory.js',

  '/js/libs/codemirror/codemirror.css',
  '/js/libs/codemirror/theme/monokai.css',

  '/js/libs/codemirror/codemirror.js',
  '/js/libs/codemirror/mode/javascript.js',
  '/js/libs/codemirror/mode/glsl.js',

  '/js/libs/esprima.js',
  '/js/libs/ffmpeg.min.js',
  '/js/libs/jsonlint.js',

  '/js/libs/nucleardata/radiation.js',

  '/js/libs/codemirror/addon/dialog.css',
  '/js/libs/codemirror/addon/show-hint.css',
  '/js/libs/codemirror/addon/tern.css',

  '/js/libs/codemirror/addon/dialog.js',
  '/js/libs/codemirror/addon/show-hint.js',
  '/js/libs/codemirror/addon/tern.js',
  '/js/libs/acorn/acorn.js',
  '/js/libs/acorn/acorn_loose.js',
  '/js/libs/acorn/walk.js',
  '/js/libs/ternjs/polyfill.js',
  '/js/libs/ternjs/signal.js',
  '/js/libs/ternjs/tern.js',
  '/js/libs/ternjs/def.js',
  '/js/libs/ternjs/comment.js',
  '/js/libs/ternjs/infer.js',
  '/js/libs/ternjs/doc_comment.js',
  '/js/libs/tern-threejs/threejs.js',

  '/js/libs/geometry/PolyconeGeometry.js',
  '/js/libs/geometry/PolyhedronGeometry.js',

  '/js/libs/CSGMesh.js',

  '/js/libs/signals.min.js',
  '/js/libs/ui.js',
  '/js/libs/ui.three.js',

  '/js/libs/app.js',
  '/js/Player.js',
  '/js/Script.js',

  '/js/EditorControls.js',
  '/js/Storage.js',

  '/js/Editor.js',
  '/js/Config.js',
  '/js/History.js',
  '/js/Loader.js',
  '/js/LoaderUtils.js',
  '/js/Menubar.js',
  '/js/Menubar.File.js',
  '/js/Menubar.Edit.js',
  '/js/Menubar.Add.js',
  '/js/Menubar.Play.js',
  '/js/Menubar.Examples.js',
  '/js/Menubar.Help.js',
  '/js/Menubar.View.js',
  '/js/Menubar.Status.js',
  '/js/Resizer.js',
  '/js/Sidebar.js',
  '/js/Sidebar.Scene.js',
  '/js/Sidebar.Project.js',
  '/js/Sidebar.Project.Materials.js',
  '/js/Sidebar.Project.Renderer.js',
  '/js/Sidebar.Project.Video.js',
  '/js/Sidebar.Settings.js',
  '/js/Sidebar.Settings.History.js',
  '/js/Sidebar.Settings.Shortcuts.js',
  '/js/Sidebar.Settings.Viewport.js',
  '/js/Sidebar.Properties.js',
  '/js/Sidebar.Object.js',
  '/js/Sidebar.Geometry.js',
  '/js/Sidebar.Geometry.BufferGeometry.js',
  '/js/Sidebar.Geometry.Modifiers.js',
  '/js/Sidebar.Geometry.BoxGeometry.js',
  '/js/Sidebar.Geometry.CapsuleGeometry.js',
  '/js/Sidebar.Geometry.CircleGeometry.js',
  '/js/Sidebar.Geometry.CylinderGeometry.js',
  '/js/Sidebar.Geometry.DodecahedronGeometry.js',
  '/js/Sidebar.Geometry.ExtrudeGeometry.js',
  '/js/Sidebar.Geometry.IcosahedronGeometry.js',
  '/js/Sidebar.Geometry.LatheGeometry.js',
  '/js/Sidebar.Geometry.OctahedronGeometry.js',
  '/js/Sidebar.Geometry.PlaneGeometry.js',
  '/js/Sidebar.Geometry.RingGeometry.js',
  '/js/Sidebar.Geometry.SphereGeometry.js',
  '/js/Sidebar.Geometry.ShapeGeometry.js',
  '/js/Sidebar.Geometry.TetrahedronGeometry.js',
  '/js/Sidebar.Geometry.TorusGeometry.js',
  '/js/Sidebar.Geometry.TorusKnotGeometry.js',
  '/js/Sidebar.Geometry.TubeGeometry.js',
  '/js/Sidebar.Geometry.aConeGeometry.js',
  '/js/Sidebar.Geometry.aCutTubeGeometry.js',
  '/js/Sidebar.Geometry.aEllipsoidGeometry.js',
  '/js/Sidebar.Geometry.aEllipticalConeGeometry.js',
  '/js/Sidebar.Geometry.aEllipticalCylinderGeometry.js',
  '/js/Sidebar.Geometry.aGenericTrapGeometry.js',
  '/js/Sidebar.Geometry.aHyperboloidGeometry.js',
  '/js/Sidebar.Geometry.aParaboloidGeometry.js',
  '/js/Sidebar.Geometry.aParallGeometry.js',
  '/js/Sidebar.Geometry.aPolyconeGeometry.js',
  '/js/Sidebar.Geometry.aPolyhedraGeometry.js',
  '/js/Sidebar.Geometry.aTetrahedraGeometry.js',
  '/js/Sidebar.Geometry.aTorusGeometry.js',
  '/js/Sidebar.Geometry.aTrapeZoidGeometry.js',
  '/js/Sidebar.Geometry.aTrapeZoidPGeometry.js',
  '/js/Sidebar.Geometry.aTubeGeometry.js',
  '/js/Sidebar.Geometry.aTwistedBoxGeometry.js',
  '/js/Sidebar.Geometry.aTwistedTrapGeometry.js',
  '/js/Sidebar.Geometry.aTwistedTrdGeometry.js',
  '/js/Sidebar.Geometry.aTwistedTrdGeometry.js',
  '/js/Sidebar.Geometry.aTwistedTubeGeometry.js',

  '/js/Sidebar.Material.js',
  '/js/Sidebar.Material.BooleanProperty.js',
  '/js/Sidebar.Material.ColorProperty.js',
  '/js/Sidebar.Material.ConstantProperty.js',
  '/js/Sidebar.Material.MapProperty.js',
  '/js/Sidebar.Material.NumberProperty.js',
  '/js/Sidebar.Material.Program.js',
  '/js/Sidebar.Animation.js',
  '/js/Sidebar.Script.js',
  '/js/Strings.js',
  '/js/Toolbar.js',
  '/js/Viewport.js',
  '/js/Viewport.Camera.js',
  '/js/Viewport.Shading.js',
  '/js/Viewport.Info.js',
  '/js/Viewport.Selector.js',
  '/js/Viewport.ViewHelper.js',
  '/js/Viewport.VR.js',

  '/js/Command.js',
  '/js/commands/AddObjectCommand.js',
  '/js/commands/RemoveObjectCommand.js',
  '/js/commands/MoveObjectCommand.js',
  '/js/commands/SetPositionCommand.js',
  '/js/commands/SetRotationCommand.js',
  '/js/commands/SetScaleCommand.js',
  '/js/commands/SetValueCommand.js',
  '/js/commands/SetUuidCommand.js',
  '/js/commands/SetColorCommand.js',
  '/js/commands/SetGeometryCommand.js',
  '/js/commands/SetGeometryValueCommand.js',
  '/js/commands/MultiCmdsCommand.js',
  '/js/commands/AddScriptCommand.js',
  '/js/commands/RemoveScriptCommand.js',
  '/js/commands/SetScriptValueCommand.js',
  '/js/commands/SetMaterialCommand.js',
  '/js/commands/SetMaterialColorCommand.js',
  '/js/commands/SetMaterialMapCommand.js',
  '/js/commands/SetMaterialValueCommand.js',
  '/js/commands/SetMaterialVectorCommand.js',
  '/js/commands/SetSceneCommand.js',
  '/js/commands/Commands.js',


  '/examples/arkanoid.app.json',
  '/examples/camera.app.json',
  '/examples/particles.app.json',
  '/examples/pong.app.json',
  '/examples/shaders.app.json',
  '/examples/kidney.stl',
  '/examples/monkey.stl',
  '/examples/skull.glb',
  '/examples/brain.glb'
];

self.addEventListener( 'install', async function () {
  const cache = await caches.open( cacheName );

  assets.forEach( async function ( asset ) {
    try {
      await cache.add( asset );
    } catch {
      console.warn( '[SW] Cound\'t cache:', asset );
    }
  } );
} );

self.addEventListener( 'fetch', async function ( event ) {
  const request = event.request;

  if ( request.url.startsWith( 'chrome-extension' ) ) return;

  event.respondWith( networkFirst( request ) );
} );

async function networkFirst( request ) {

  try {
    let response = await fetch( request );

    if ( request.url.endsWith( 'editor/' ) || request.url.endsWith( 'editor/index.html' ) ) { // copied from coi-serviceworker
      const newHeaders = new Headers( response.headers );
      newHeaders.set( 'Cross-Origin-Embedder-Policy', 'require-corp' );
      newHeaders.set( 'Cross-Origin-Opener-Policy', 'same-origin' );

      response = new Response( response.body, { status: response.status, statusText: response.statusText, headers: newHeaders } );
    }

    const cache = await caches.open( cacheName );
    cache.put( request, response.clone() );
    return response;
  } catch {
    const cachedResponse = await caches.match( request );
    if ( cachedResponse === undefined ) {
      console.warn( '[SW] Not cached:', request.url );
    }

    return cachedResponse;
  }
}

