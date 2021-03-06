var testUtil = require("./test-util");

describe("data()", function() {
  describe("update", function() {
    describe("selectAll", function() {
      it("should be able to set longer data on fewer elements", function(done) {
        var html = `
            <div id="d3">
            <strong>a1</strong>
            <strong>a2</strong>
            </div>
          `;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var updatedElements = lib
              .select("#d3")
              .selectAll("strong")
              .data([0, 1, 2, 3]);

          expect(updatedElements[0].length).toEqual(4, libName); // extra slots added
          expect(updatedElements[0][0].__data__).toEqual(0, libName);
          expect(updatedElements[0][1].__data__).toEqual(1, libName);

          // no extra slots
          expect(updatedElements[0][2]).toBeUndefined(libName);
        }, done);
      });

      it("should be able to set shorter data on more elements", function(done) {
        var html = `
            <div id="d3">
            <strong>a1</strong>
            <strong>a2</strong>
            <strong>a3</strong>
            </div>
          `;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var updatedElements = lib
              .select("#d3")
              .selectAll("strong")
              .data([0, 1]);

          expect(updatedElements[0].length).toEqual(2, libName);
          expect(updatedElements[0][0].__data__).toEqual(0, libName);
          expect(updatedElements[0][1].__data__).toEqual(1, libName);

          // no extra slots
          expect(updatedElements[0][2]).toBeUndefined(libName);
        }, done);
      });

      it("should be able to set data on equal number of elements", function(done) {
        var html = `
            <div id="d3">
            <strong>a1</strong>
            <strong>a2</strong>
            </div>
          `;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var updatedElements = lib
              .select("#d3")
              .selectAll("strong")
              .data([0, 1]);

          expect(updatedElements[0].length).toEqual(2, libName);
          expect(updatedElements[0][0].__data__).toEqual(0, libName);
          expect(updatedElements[0][1].__data__).toEqual(1, libName);

          // no extra slots
          expect(updatedElements[0][2]).toBeUndefined(libName);
        }, done);
      });

      it("should update multiple sub selections of different sizes", function(done) {
        var html = `
            <div id="d3">
            <p>
            <strong>a1</strong>
            </p>
          <p>
          <strong>a1</strong>
          <strong>a2</strong>
          </p>
          <p>
          <strong>a1</strong>
          <strong>a2</strong>
          <strong>a3</strong>
          </p>
          </div>
          `;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var updatedElements = lib
              .selectAll("p")
              .selectAll("strong")
              .data([0, 1]);

          expect(updatedElements[0][0].__data__).toEqual(0, libName);
          expect(updatedElements[0][1]).toBeUndefined(libName);

          expect(updatedElements[1][0].__data__).toEqual(0, libName);
          expect(updatedElements[1][1].__data__).toEqual(1, libName);
          expect(updatedElements[1][2]).toBeUndefined(libName);

          expect(updatedElements[2][0].__data__).toEqual(0, libName);
          expect(updatedElements[2][1].__data__).toEqual(1, libName);
          expect(updatedElements[1][2]).toBeUndefined(libName);
        }, done);
      });

    });

    describe("select", function() {
      it("should leave selection empty after data() on failed select()", function(done) {
        // regression: minid3 was creating [[null]] after data call

        var html = ``;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var updatedElements = lib
              .select("p")
              .data([0, 1, 2]);

          expect(updatedElements[0].length).toEqual(3, libName);
          expect(updatedElements[0][0]).toBeUndefined(libName);
          expect(updatedElements[0][1]).toBeUndefined(libName);
          expect(updatedElements[0][2]).toBeUndefined(libName);
        }, done);
      });

      it("should bind 1 data to el, pad length to rest data on successful select()", function(done) {
        var html = `<p></p>`;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var elements = lib
              .select("p")
              .data([0, 1, 2]);

          expect(elements[0].length).toEqual(3, libName);
          expect(elements[0][0].__data__).toEqual(0, libName);
          expect(elements[0][0].nodeName).toEqual("P", libName);
          expect(elements[0][1]).toBeUndefined(libName);
        }, done);
      });

      it("should bind no els when successful select but no data", function(done) {
        var html = `<p></p>`;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var elements = lib
              .select("p")
              .data([]);

          expect(elements[0].length).toEqual(0, libName);
          expect(elements[0][0]).toBeUndefined(libName);
        }, done);
      });
    });
  });

  describe("enter()", function() {
    describe("selectAll", function() {
      it("should return unbound elements when extra data", function(done) {
        var html = `
            <div id="d3">
            <strong>a1</strong>
            <strong>a2</strong>
            </div>
          `;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var unboundStrongs = lib
              .select("#d3")
              .selectAll("strong")
              .data([0, 1, 2, 3])
              .enter();

          expect(unboundStrongs[0].length).toEqual(4, libName); // pads up to bound items

          expect(unboundStrongs[0][0]).toBeUndefined(libName);
          expect(unboundStrongs[0][1]).toBeUndefined(libName);

          expect(unboundStrongs[0][2].__data__).toEqual(2, libName);
          expect(unboundStrongs[0][3].__data__).toEqual(3, libName);
        }, done);
      });

      it("should return no unbound elements when no extra data", function(done) {
        var html = `
            <div id="d3">
            <strong>a1</strong>
            <strong>a2</strong>
            </div>
          `;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var unboundStrongs = lib
              .select("#d3")
              .selectAll("strong")
              .data([0, 1])
              .enter();

          expect(unboundStrongs[0].length).toEqual(2, libName); // pads up to bound items

          expect(unboundStrongs[0][2]).toBeUndefined(libName);
        }, done);
      });

      it("should return no unbound elements when fewer datums than elements", function(done) {
        var html = `
            <div id="d3">
            <strong>a1</strong>
            <strong>a2</strong>
            <strong>a3</strong>
            </div>
          `;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var unboundStrongs = lib
              .select("#d3")
              .selectAll("strong")
              .data([0, 1])
              .enter();

          expect(unboundStrongs[0].length).toEqual(2, libName); // only pads to number of bound els

          expect(unboundStrongs[0][0]).toBeUndefined(libName);
          expect(unboundStrongs[0][1]).toBeUndefined(libName);
        }, done);
      });

      it("should update multiple sub selections of different sizes", function(done) {
        var html = `
            <div id="d3">
            <p>
            <strong>a1</strong>
            </p>
          <p>
          <strong>a1</strong>
          <strong>a2</strong>
          </p>
          <p>
          <strong>a1</strong>
          <strong>a2</strong>
          <strong>a3</strong>
          </p>
          </div>
          `;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var updatedElements = lib
              .selectAll("p")
              .selectAll("strong")
              .data([0, 1])
              .enter();

          expect(updatedElements[0][0]).toBeUndefined(libName);
          expect(updatedElements[0][1].__data__).toEqual(1, libName);

          expect(updatedElements[1][0]).toBeUndefined(libName);
          expect(updatedElements[1][1]).toBeUndefined(libName);
          expect(updatedElements[1][2]).toBeUndefined(libName);

          expect(updatedElements[2][0]).toBeUndefined(libName);
          expect(updatedElements[2][1]).toBeUndefined(libName);
          expect(updatedElements[2][2]).toBeUndefined(libName);
        }, done);
      });
    });

    describe("select", function() {
      it("shouldn't put extra undef in enter() sel after data(), failed select()", function(done) {
        // regression: minid3 was creating [[undefined, p, p, p]] after enter() call

        var html = ``;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var enteredElements = lib
              .select("p")
              .data([0, 1, 2])
              .enter();

          expect(enteredElements[0].length).toEqual(3, libName);
          expect(enteredElements[0][0].__data__).toEqual(0, libName);
          expect(enteredElements[0][1].__data__).toEqual(1, libName);
          expect(enteredElements[0][2].__data__).toEqual(2, libName);
          expect(enteredElements[0][3]).toBeUndefined(libName);
        }, done);
      });

      it("should have 1 undef for data bound el, ghost els in for rest of data", function(done) {
        var html = `<p></p>`;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var enteredElements = lib
              .select("p")
              .data([0, 1, 2])
              .enter();

          expect(enteredElements[0].length).toEqual(3, libName);

          expect(enteredElements[0][0]).toBeUndefined(libName);

          expect(enteredElements[0][1].__data__).toEqual(1, libName);
          expect(enteredElements[0][2].__data__).toEqual(2, libName);

          expect(enteredElements[0][3]).toBeUndefined(libName);
        }, done);
      });

      it("should have zero len array when 1 selected el and no data", function(done) {
        var html = `<p></p>`;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var enteredElements = lib
              .select("p")
              .data([])
              .enter();

          expect(enteredElements[0].length).toEqual(0, libName);
          expect(enteredElements[0][0]).toBeUndefined(libName);
        }, done);
      });
    });
  });

  describe("exit()", function() {
    describe("selectAll", function() {
      it("should return no elements when extra data", function(done) {
        var html = `
            <div id="d3">
            <strong>a1</strong>
            <strong>a2</strong>
            </div>
          `;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var elements = lib
              .select("#d3")
              .selectAll("strong")
              .data([0, 1, 2, 3])
              .exit();

          expect(elements[0].length).toEqual(2, libName);
          expect(elements[0][0]).toBeUndefined(libName);
          expect(elements[0][1]).toBeUndefined(libName);
          expect(elements[0][2]).toBeUndefined(libName);
          expect(elements[0][3]).toBeUndefined(libName);

        }, done);
      });

      it("should return no elements when no extra data", function(done) {
        var html = `
            <div id="d3">
            <strong>a1</strong>
            <strong>a2</strong>
            </div>
          `;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var elements = lib
              .select("#d3")
              .selectAll("strong")
              .data([0, 1])
              .exit();

          expect(elements[0].length).toEqual(2, libName); // pads up to bound items
          expect(elements[0][0]).toBeUndefined(libName);
          expect(elements[0][1]).toBeUndefined(libName);
          expect(elements[0][2]).toBeUndefined(libName);
        }, done);
      });

      it("should return elements when fewer datums than elements", function(done) {
        var html = `
            <div id="d3">
            <strong>a1</strong>
            <strong>a2</strong>
            <strong>a3</strong>
            <strong>a4</strong>
            </div>
          `;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var elements = lib
              .select("#d3")
              .selectAll("strong")
              .data([0, 1])
              .exit();

          expect(elements[0].length).toEqual(4, libName);

          expect(elements[0][0]).toBeUndefined(libName);
          expect(elements[0][1]).toBeUndefined(libName);
          expect(elements[0][2].nodeName).toEqual("STRONG", libName);
          expect(elements[0][3].nodeName).toEqual("STRONG", libName);
        }, done);
      });

      it("should update multiple sub selections of different sizes", function(done) {
        var html = `
            <div id="d3">
            <p>
            <strong>a1</strong>
            </p>
          <p>
          <strong>a1</strong>
          <strong>a2</strong>
          </p>
          <p>
          <strong>a1</strong>
          <strong>a2</strong>
          <strong>a3</strong>
          </p>
          </div>
          `;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var updatedElements = lib
              .selectAll("p")
              .selectAll("strong")
              .data([0, 1])
              .exit();

          expect(updatedElements[0][0]).toBeUndefined(libName);
          expect(updatedElements[0][1]).toBeUndefined(libName);

          expect(updatedElements[1][0]).toBeUndefined(libName);
          expect(updatedElements[1][1]).toBeUndefined(libName);
          expect(updatedElements[1][2]).toBeUndefined(libName);

          expect(updatedElements[2][0]).toBeUndefined(libName);
          expect(updatedElements[2][1]).toBeUndefined(libName);
          expect(updatedElements[2][2].nodeName).toEqual("STRONG", libName);
        }, done);
      });
    });

    describe("select", function() {
      it("should (yes) put extra undef in exit() sel after data(), failed select()", function(done) {
        // I don't understand this behaviour - why pad the exit sub selection
        // with an undefined element corresponding to the failed selection?

        var html = ``;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var elements = lib
              .select("p")
              .data([0, 1, 2])
              .exit();

          expect(elements[0].length).toEqual(1, libName);
          expect(elements[0][0]).toBeUndefined(libName);
        }, done);
      });

      it("should pad exit sel with undef when select 1 el", function(done) {
        var html = `<p></p>`;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var elements = lib
              .select("p")
              .data([0, 1, 2])
              .exit();

          expect(elements[0].length).toEqual(1, libName);
          expect(elements[0][0]).toBeUndefined(libName);
        }, done);
      });

      it("should exit 1 el when 1 selected and no data", function(done) {
        var html = `<p></p>`;

        testUtil.runWithD3AndMinid3(html, function(lib, libName) {
          var elements = lib
              .select("p")
              .data([])
              .exit();

          expect(elements[0].length).toEqual(1, libName);
          expect(elements[0][0].nodeName).toEqual("P", libName);
        }, done);
      });
    });
  });
});
