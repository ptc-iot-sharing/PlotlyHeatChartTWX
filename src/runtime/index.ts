import {
    TWWidgetDefinition,
    property,
    canBind,
    TWEvent,
    event,
    service,
    didBind,
} from 'typescriptwebpacksupport/widgetRuntimeSupport';
import * as Plotly from 'plotly.js/dist/plotly';
import 'plotly.js/src/css/style.scss';



/**
 * A 2D heat chart that uses the plotly library.
 */
@TWWidgetDefinition
class PlotlyHeatChart extends TWRuntimeWidget {

    /**
     * The field to use for the X axis values.
     */
    @property xField: string;

    /**
     * The field to use for the Y axis values. 
     */
    @property yField: string;

    /**
     * The field to use for the Z axis values. 
     */
    @property zField: string;

    /**
     * If enabled, rows for the same X and Y coordinates will be summed up. If disabled, subsequent values will ovewrite the previous values.
     */
    @property mergeOverlappingValues: boolean;

    /**
     * The minimum value for the Z axis.
     */
    zMin: number;

    /**
     * The maximum value for the Z axis.
     */
    zMax: number;

    /**
     * The data source used by plotly.
     */
    matrix: number[][];

    /**
     * The raw data source used by the widget.
     */
    @property set data(data: TWInfotable) {
        const x = this.xField;
        const y = this.yField;
        const z = this.zField;

        let zMin = Number.POSITIVE_INFINITY, zMax = Number.NEGATIVE_INFINITY;

        const mergeOverlappingValues = this.mergeOverlappingValues;

        // These maps contain the possible values for the X and Y axes as keys.
        // Their values represent the mapping between the label and the corresponding matrix index.
        let yValues: Dictionary<number> = {};
        let xValues: Dictionary<number> = {};

        let xRange = 0;
        let yRange = 0;

        // Determine the minimum and maximum values for the Z values.
        // Also detemine the number of values available for the X and Y fields, based on these ranges the size of the matrix may be determined
        for (const row of data.rows) {
            const xValue = row[x];
            const yValue = row[y];
            const zValue = row[z] as number;

            if (zMin > zValue) {
                zMin = zValue;
            }

            if (zMax < zValue) {
                zMax = zValue;
            }

            if (!(xValue in xValues)) {
                xValues[xValue] = xRange;
                xRange += 1;
            }

            if (!(yValue in yValues)) {
                yValues[yValue] = yRange;
                yRange += 1;
            }
        }

        // Construct the 2D matrix to be used by plotly
        const matrix = Array(yRange);
        for (let i = 0; i < yRange; i++) {
            matrix[i] = Array(xRange);
        }

        // Traverse the data source again to fill out the matrix
        for (const row of data.rows) {
            const xValue = row[x];
            const yValue = row[y];
            const zValue = row[z] as number;

            if (mergeOverlappingValues) {
                matrix[yValues[yValue]][xValues[xValue]] = (matrix[yValues[yValue]][xValues[xValue]] || 0) + zValue;
            }
            else {
                matrix[yValues[yValue]][xValues[xValue]] = zValue;
            }
        }

        // Draw the plot
        Plotly.newPlot(this.jqElement[0], [{
            // Insertion order is not guaranteed for number-convertible keys, so the insertion order must be specified manually
            x: Object.keys(xValues).sort((x1, x2) => xValues[x1] - xValues[x2]),
            y: Object.keys(yValues).sort((y1, y2) => yValues[y1] - yValues[y2]),
            z: matrix,
            type: 'heatmap',
            colorscale: 'Turbo',
        }]);

        this.matrix = matrix;

    }

    /**
     * Invoked to obtain the HTML structure corresponding to the widget.
     * @return      The HTML structure.
     */
    renderHtml(): string {
        return `<div class="widget-content widget-demo"></div>`;
    }

    /**
     * Invoked after the widget's HTML element has been created.
     * The `jqElement` property will reference the correct element within this method.
     */
    async afterRender(): Promise<void> {
    }

    /**
     * Invoked by the runtime whenever this widget is resized.
     * @param width     The new width.
     * @param height    The new height.
     */
    resize(width: number, height: number) {
        if (this.matrix) Plotly.relayout(this.jqElement[0], {width, height});
    }

    /**
     * Invoked when this widget is destroyed. This method should be used to clean up any resources created by the widget
     * that cannot be reclaimed by the garbage collector automatically (e.g. HTML elements added to the page outside of the widget's HTML element)
     */
    beforeDestroy?(): void {
        // add disposing logic
    }
}
