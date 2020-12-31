// automatically import the css file
import './ide.css';
import {
    TWWidgetDefinition,
    autoResizable,
    description,
    property,
    defaultValue,
    bindingTarget,
    service,
    event,
    bindingSource,
    nonEditable,
    willSet,
    didSet,
    sourcePropertyName,
} from 'typescriptwebpacksupport/widgetIDESupport';
import widgetIconUrl from '../images/icon.png';

/**
 * A 2D heat chart that uses the plotly library.
 */
@TWWidgetDefinition('Heat Chart', autoResizable)
class PlotlyHeatChart extends TWComposerWidget {

    /**
     * The data source for this chart. This must be an infotable containing fields for the X, Y and Z axes.
     */
    @property('INFOTABLE', bindingTarget) data: TWInfotable;

    /**
     * The field to use for the X axis values.
     */
    @property("FIELDNAME", sourcePropertyName('data')) xField: string;

    /**
     * The field to use for the Y axis values.
     */
    @property('FIELDNAME', sourcePropertyName('data')) yField: string;

    /**
     * The field to use for the Z axis values.  This should be a numeric value.
     */
    @property('FIELDNAME', sourcePropertyName('data')) zField: string;

    @description('If enabled, rows for the same X and Y coordinates will be summed up. If disabled, subsequent values will ovewrite the previous values.')
    @property('BOOLEAN', defaultValue(true)) mergeOverlappingValues: boolean;

    /**
     * Invoked to obtain the URL to this widget's icon.
     * @return  The URL.
     */
    widgetIconUrl(): string {
        return widgetIconUrl;
    }

    /**
     * Invoked to obtain the HTML structure corresponding to the widget.
     * @return      The HTML structure.
     */
    renderHtml(): string {
        return `<div class="widget-content widget-plotly-heatchart"></div>`;
    }

    /**
     * Invoked after the widget's HTML element has been created.
     * The `jqElement` property will reference the correct element within this method.
     */
    afterRender(): void {
        // add after logic render here
    }

    /**
     * Invoked when this widget is destroyed. This method should be used to clean up any resources created by the widget
     * that cannot be reclaimed by the garbage collector automatically (e.g. HTML elements added to the page outside of the widget's HTML element)
     */
    beforeDestroy(): void {
        // add dispose logic here
    }
}
