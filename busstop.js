var PredictionCard = React.createClass({
    render: function() {
        var minutes = this.props.prediction.attr('minutes');
        var epochTime = parseInt(this.props.prediction.attr('epochTime'));
        var affectedByLayover = this.props.prediction.attr('affectedByLayover') === 'true';

        var arrivalTime = (new Date(epochTime)).toLocaleTimeString();

        return <li className="collection-item">
            <p>{arrivalTime} ({minutes} min) {affectedByLayover ? '*' : ''}</p>
        </li>;
    }
});

var PredictionsContainer = React.createClass({
    render: function() {
        var stopTitle = this.props.predictions.attr('stopTitle');
        var routeTag = this.props.predictions.attr('routeTag');
        var direction = this.props.predictions.find('direction').attr('title');

        var predictionList = this.props.predictions.find('prediction');

        return <ul className="collections with-header">
            <li className="collection-header blue lighten-5">
               <h5>Route {routeTag} - {stopTitle} - {direction}</h5>
            </li>
            {predictionList.map(function(i, prediction) {
                return <PredictionCard key={i} prediction={$(prediction)} />
            })}
        </ul>;
    }
});

var BusStop = React.createClass({
    parsePredictions: function(data) {
        var predictions = [];
        var xmlPredictions = $(data).find('predictions');
        xmlPredictions.each(function(i, ps) {
            predictions.push(ps); 
        });

        this.setState({'predictions': predictions});
    },

    getPredictions: function() {
        $.ajax({
            url: url,
            dataType: 'xml',
            success: function(data) {
                this.parsePredictions(data)
            }.bind(this)
        });
    },

    getInitialState: function() {
        return {'predictions': []};
    },

    componentDidMount: function() {
        this.getPredictions();
    },

    render: function() {
        if (this.state.predictions.length > 0) {
            var content = this.state.predictions.map(function(predictions, i) {
                return <PredictionsContainer key={i} predictions={$(predictions)} />
            });
        }
        else {
            var content = (() => {
                return <div class="preloader-wrapper small active">
                    <div class="spinner-layer spinner-green-only">
                        <div class="circle-clipper left">
                            <div class="circle"></div>
                        </div>
                        <div class="gap-patch">
                            <div class="circle"></div>
                        </div>
                        <div class="circle-clipper right">
                            <div class="circle"></div>
                        </div>
                    </div>
                </div>
            }());
        }

        return <div>
            {content}
        </div>;
    }
});

ReactDOM.render(
    <BusStop />,
    document.getElementById('content')
);
