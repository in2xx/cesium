// A simple demo of 3D Tiles feature picking with hover and select behavior
// Building data courtesy of NYC OpenData portal: http://www1.nyc.gov/site/doitt/initiatives/3d-building.page

  Cesium.Ion.defaultAccessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiJlMWIzNDVmZi04YjcyLTRmNTgtOTRjNS1jYjE5M2Y1MzU1OTMiLCJpZCI6ODExMTMsImlhdCI6MTY0MzUyNjIwMX0.lpmVoBleVGPbSTTeICXmeFwNsXgv2ypVtU5bmMrrISY";

  var viewer = new Cesium.Viewer("cesium");
  viewer.animation.container.style.visibility = "hidden";
  viewer.timeline.container.style.visibility = "hidden";
  
  //viewer.scene.globe.depthTestAgainstTerrain = true;
  
  // Set the initial camera view to look at Manhattan
  var initialPosition = Cesium.Cartesian3.fromDegrees(
      138,
      29,
      4000000
  );
  var initialOrientation = new Cesium.HeadingPitchRoll.fromDegrees(
    0,
    -1.4,
    0
  );
  viewer.scene.camera.setView({
    destination: initialPosition,
    orientation: initialOrientation,
    endTransform: Cesium.Matrix4.IDENTITY,
  });
  
  // Load the TOKYO buildings tileset
  var datasets = [
      "13101_chiyoda-ku",
      "13102_chuo-ku",
      "13103_minato-ku",
      "13104_shinjuku-ku",
      "13105_bunkyo-ku",
      "13106_taito-ku",
      "13107_sumida-ku",
      "13108_koto-ku",
      "13109_shinagawa-ku",
      "13110_meguro-ku",
      "13111_ota-ku",
      "13112_setagaya-ku",
      "13113_shibuya-ku",
      "13114_nakano-ku",
      "13115_suginami-ku",
      "13116_toshima-ku",
      "13117_kita-ku",
      "13118_arakawa-ku",
      "13119_itabashi-ku",
      "13120_nerima-ku",
      "13121_adachi-ku",
      "13122_katsushika-ku",
      "13123_edogawa-ku"
  ];

  for (data of datasets){
    viewer.scene.primitives.add(new Cesium.Cesium3DTileset({url:"https://s3-ap-northeast-1.amazonaws.com/3dimension.jp/13000_tokyo-egm96/" + data + "_notexture/tileset.json"}));
  }

  /*
  // HTML overlay for showing feature name on mouseover
  var nameOverlay = document.createElement("div");
  viewer.container.appendChild(nameOverlay);
  nameOverlay.className = "backdrop";
  nameOverlay.style.display = "none";
  nameOverlay.style.position = "absolute";
  nameOverlay.style.bottom = "0";
  nameOverlay.style.left = "0";
  nameOverlay.style["pointer-events"] = "none";
  nameOverlay.style.padding = "4px";
  nameOverlay.style.backgroundColor = "black";
  
  // Information about the currently selected feature
  var selected = {
    feature: undefined,
    originalColor: new Cesium.Color(),
  };
  
  // An entity object which will hold info about the currently selected feature for infobox display
  var selectedEntity = new Cesium.Entity();
  
  // Get default left click handler for when a feature is not picked on left click
  var clickHandler = viewer.screenSpaceEventHandler.getInputAction(
    Cesium.ScreenSpaceEventType.LEFT_CLICK
  );
  */
  
  /*
  // If silhouettes are supported, silhouette features in blue on mouse over and silhouette green on mouse click.
  // If silhouettes are not supported, change the feature color to yellow on mouse over and green on mouse click.
  if (
    Cesium.PostProcessStageLibrary.isSilhouetteSupported(viewer.scene)
  ) {
    // Silhouettes are supported
    var silhouetteBlue = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    silhouetteBlue.uniforms.color = Cesium.Color.BLUE;
    silhouetteBlue.uniforms.length = 0.01;
    silhouetteBlue.selected = [];
  
    var silhouetteGreen = Cesium.PostProcessStageLibrary.createEdgeDetectionStage();
    silhouetteGreen.uniforms.color = Cesium.Color.LIME;
    silhouetteGreen.uniforms.length = 0.01;
    silhouetteGreen.selected = [];
  
    viewer.scene.postProcessStages.add(
      Cesium.PostProcessStageLibrary.createSilhouetteStage([
        silhouetteBlue,
        silhouetteGreen,
      ])
    );
  
    // Silhouette a feature blue on hover.
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
      movement
    ) {
      // If a feature was previously highlighted, undo the highlight
      silhouetteBlue.selected = [];
  
      // Pick a new feature
      var pickedFeature = viewer.scene.pick(movement.endPosition);
      if (!Cesium.defined(pickedFeature)) {
        nameOverlay.style.display = "none";
        return;
      }
  
      // A feature was picked, so show it's overlay content
      nameOverlay.style.display = "block";
      nameOverlay.style.bottom =
        viewer.canvas.clientHeight - movement.endPosition.y + "px";
      nameOverlay.style.left = movement.endPosition.x + "px";
      var name = pickedFeature.getProperty("BIN");
      nameOverlay.textContent = name;
  
      // Highlight the feature if it's not already selected.
      if (pickedFeature !== selected.feature) {
        silhouetteBlue.selected = [pickedFeature];
      }
    },
    Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  
    // Silhouette a feature on selection and show metadata in the InfoBox.
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
      movement
    ) {
      // If a feature was previously selected, undo the highlight
      silhouetteGreen.selected = [];
  
      // Pick a new feature
      var pickedFeature = viewer.scene.pick(movement.position);
      if (!Cesium.defined(pickedFeature)) {
        clickHandler(movement);
        return;
      }
  
      // Select the feature if it's not already selected
      if (silhouetteGreen.selected[0] === pickedFeature) {
        return;
      }
  
      // Save the selected feature's original color
      var highlightedFeature = silhouetteBlue.selected[0];
      if (pickedFeature === highlightedFeature) {
        silhouetteBlue.selected = [];
      }
  
      // Highlight newly selected feature
      silhouetteGreen.selected = [pickedFeature];
  
      // Set feature infobox description
      var featureName = pickedFeature.getProperty("id");
      selectedEntity.name = featureName;
      selectedEntity.description =
        'Loading <div class="cesium-infoBox-loading"></div>';
      viewer.selectedEntity = selectedEntity;
      selectedEntity.description =
        '<table class="cesium-infoBox-defaultTable"><tbody>' +
        "<tr><th>ID</th><td>" +
        pickedFeature.getProperty("id") +
        "</td></tr>" +
        "<tr><th>property</th><td>" +
        pickedFeature.getProperty("property") +
        "</td></tr>" +
        "<tr><th>SOURCE ID</th><td>" +
        pickedFeature.getProperty("SOURCE_ID") +
        "</td></tr>" +
        "</tbody></table>";
    },
    Cesium.ScreenSpaceEventType.LEFT_CLICK);
  } else {
    // Silhouettes are not supported. Instead, change the feature color.
  
    // Information about the currently highlighted feature
    var highlighted = {
      feature: undefined,
      originalColor: new Cesium.Color(),
    };
  
    // Color a feature yellow on hover.
    viewer.screenSpaceEventHandler.setInputAction(function onMouseMove(
      movement
    ) {
      // If a feature was previously highlighted, undo the highlight
      if (Cesium.defined(highlighted.feature)) {
        highlighted.feature.color = highlighted.originalColor;
        highlighted.feature = undefined;
      }
      // Pick a new feature
      var pickedFeature = viewer.scene.pick(movement.endPosition);
      if (!Cesium.defined(pickedFeature)) {
        nameOverlay.style.display = "none";
        return;
      }
      // A feature was picked, so show it's overlay content
      nameOverlay.style.display = "block";
      nameOverlay.style.bottom =
        viewer.canvas.clientHeight - movement.endPosition.y + "px";
      nameOverlay.style.left = movement.endPosition.x + "px";
      var name = pickedFeature.getProperty("name");
      if (!Cesium.defined(name)) {
        name = pickedFeature.getProperty("id");
      }
      nameOverlay.textContent = name;
      // Highlight the feature if it's not already selected.
      if (pickedFeature !== selected.feature) {
        highlighted.feature = pickedFeature;
        Cesium.Color.clone(
          pickedFeature.color,
          highlighted.originalColor
        );
        pickedFeature.color = Cesium.Color.YELLOW;
      }
    },
    Cesium.ScreenSpaceEventType.MOUSE_MOVE);
  
    // Color a feature on selection and show metadata in the InfoBox.
    viewer.screenSpaceEventHandler.setInputAction(function onLeftClick(
      movement
    ) {
      // If a feature was previously selected, undo the highlight
      if (Cesium.defined(selected.feature)) {
        selected.feature.color = selected.originalColor;
        selected.feature = undefined;
      }
      // Pick a new feature
      var pickedFeature = viewer.scene.pick(movement.position);
      if (!Cesium.defined(pickedFeature)) {
        clickHandler(movement);
        return;
      }
      // Select the feature if it's not already selected
      if (selected.feature === pickedFeature) {
        return;
      }
      selected.feature = pickedFeature;
      // Save the selected feature's original color
      if (pickedFeature === highlighted.feature) {
        Cesium.Color.clone(
          highlighted.originalColor,
          selected.originalColor
        );
        highlighted.feature = undefined;
      } else {
        Cesium.Color.clone(pickedFeature.color, selected.originalColor);
      }
      // Highlight newly selected feature
      pickedFeature.color = Cesium.Color.LIME;
      // Set feature infobox description
      var featureName = pickedFeature.getProperty("name");
      selectedEntity.name = featureName;
      selectedEntity.description =
        'Loading <div class="cesium-infoBox-loading"></div>';
      viewer.selectedEntity = selectedEntity;
      selectedEntity.description =
        '<table class="cesium-infoBox-defaultTable"><tbody>' +
        "<tr><th>BIN</th><td>" +
        pickedFeature.getProperty("BIN") +
        "</td></tr>" +
        "<tr><th>DOITT ID</th><td>" +
        pickedFeature.getProperty("DOITT_ID") +
        "</td></tr>" +
        "<tr><th>SOURCE ID</th><td>" +
        pickedFeature.getProperty("SOURCE_ID") +
        "</td></tr>" +
        "<tr><th>Longitude</th><td>" +
        pickedFeature.getProperty("longitude") +
        "</td></tr>" +
        "<tr><th>Latitude</th><td>" +
        pickedFeature.getProperty("latitude") +
        "</td></tr>" +
        "<tr><th>Height</th><td>" +
        pickedFeature.getProperty("height") +
        "</td></tr>" +
        "<tr><th>Terrain Height (Ellipsoid)</th><td>" +
        pickedFeature.getProperty("TerrainHeight") +
        "</td></tr>" +
        "</tbody></table>";
    },
    Cesium.ScreenSpaceEventType.LEFT_CLICK);
  }
  */
  
  