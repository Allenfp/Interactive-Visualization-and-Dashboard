from sqlalchemy.ext.automap import automap_base
from sqlalchemy.orm import Session
from sqlalchemy import create_engine, func

from flask import Flask, render_template, jsonify

engine = create_engine("sqlite:///belly_button_biodiversity.sqlite")

Base = automap_base()
Base.prepare(engine, reflect=True)

Otu = Base.classes.otu
Samples = Base.classes.samples
Samples_metadata = Base.classes.samples_metadata

session = Session(engine)
app = Flask(__name__)

#Return to Home Page
@app.route("/")
def home():
    return render_template("index.html")

#List of Sample Names
@app.route("/names")
def names():
    sample_names = Samples.__table__.columns.keys()[1:]
    return jsonify(sample_names)

# #List of OTU descriptions.
@app.route('/otu')
def otus():
    otu_dict = {}
    otu_desc = (session.query(Otu.lowest_taxonomic_unit_found, Otu.otu_id))
    for otu, id in otu_desc:
        otu_dict[id] = otu
        
    return jsonify(otu_dict)

# #MetaData for given Sample
@app.route('/metadata/<sample>')
def metadata(sample):
    sample_ = sample.lower().replace("bb_","")
    meta_info = (session.query(Samples_metadata).filter(Samples_metadata.SAMPLEID == sample_))
    meta_dict = {}

    for data in meta_info:
        meta_dict = {
            'age': data.AGE,
            'BBTYPE': data.BBTYPE,
            'ETHNICITY': data.ETHNICITY,
            'GENDER': data.GENDER,
            'LOCATION': data.LOCATION,
            'SAMPLEID': data.SAMPLEID
        }
    # return jsonify(meta_dict)
    return jsonify(meta_dict)

# #Weekly Washing Frequency as a number.
@app.route('/wfreq/<sample>')
def wfreq(sample):
    sample_ = sample.replace("bb_","")
    wfreq_info = (session.query(Samples_metadata).filter(Samples_metadata.SAMPLEID == sample_))
    wfreq = int()

    for data in wfreq_info:
        wfreq = data.WFREQ

    return jsonify(wfreq)

# #OTU IDs and Sample Values by Sample
@app.route('/samples/<sample>')
def samples(sample):
    sample_ = sample.upper()
    sample_info = (session.query(Samples.otu_id, getattr(Samples, sample_)))
    lst1 = []
    lst2 = []

    sample_info = sorted(sample_info, key=lambda x: x[1], reverse=True)

    for otu, values in sample_info:
        if values > 0:
            lst1.append(otu)
            lst2.append(values)
        else:
            pass
    
    dict1 = {
        "otu_ids": lst1
    }
    dict2 = {
        "sample_values": lst2
    }
    

        
    return jsonify(dict1, dict2)

if __name__ == "__main__":
    app.run(debug=True)

