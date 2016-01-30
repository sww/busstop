var PredictionCard = React.createClass({
    render: function() {
        var minutes = this.props.prediction.attr('minutes');
        var seconds = this.props.prediction.attr('seconds');
        var epochTime = parseInt(this.props.prediction.attr('epochTime'));
        var affectedByLayover = this.props.prediction.attr('affectedByLayover') === 'true';

        var arrivalTime = (new Date(epochTime)).toLocaleTimeString();

        return <li className="collection-item">
            <p title={seconds + " seconds"}>{arrivalTime} ({minutes} min) {affectedByLayover ? '*' : ''}</p>
        </li>;
    }
});

var PredictionsContainer = React.createClass({
    render: function() {
        var stopTitle = this.props.predictions.attr('stopTitle');
        var routeTag = this.props.predictions.attr('routeTag');
        var direction = this.props.predictions.find('direction').attr('title');

        var predictionList = this.props.predictions.find('prediction');

        var hideElement = favoriteRoutes.indexOf(routeTag) === -1;

        return <ul className={hideElement ? "collections with-header hide" : "collections with-header"}>
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

    componentWillMount: function() {
        this.getPredictions();
    },

    componentDidMount: function() {
        this.timer = setInterval(this.getPredictions, refreshInterval)
    },

    componentWillUnmount: function() {
        clearInterval(this.timer);
    },

    render: function() {
        if (this.state.predictions.length > 0) {
            var content = this.state.predictions.map(function(predictions, i) {
                return <PredictionsContainer key={i} predictions={$(predictions)} />
            });
        }
        else {
            var content = (() => {
                return <div className="valign-wrapper">
                    <div className="valign preloader-wrapper big active">
                        <div className="spinner-layer spinner-green-only">
                            <div className="circle-clipper left">
                                <div className="circle"></div>
                            </div>
                            <div className="gap-patch">
                                <div className="circle"></div>
                            </div>
                            <div className="circle-clipper right">
                                <div className="circle"></div>
                            </div>
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
