from flask import Flask, jsonify
from flask import render_template
from flask import g
import os
from election_stats.model import Region, RegionType, Party, Result, get_engine
from sqlalchemy.orm import sessionmaker

app = Flask(__name__, static_url_path = '/static')

# configure SQLAlchemy
engine = get_engine()
Session = sessionmaker(bind=engine)

@app.route('/')
def hello():
    engine = get_engine()
    session = Session()
    states = session.query(Region).filter_by(regionType = RegionType.state).order_by(Region.name).all()
    session.commit()
    
    return render_template('main.html')

@app.route('/regions/', methods=['GET'])
def get_regions():
    session = Session()
    regions = session.query(Region).all()
    session.commit()
    return jsonify([r.to_dict() for r in regions])

@app.route('/regions/<region_id>/', methods=['GET'])
def get_region(region_id):
    session = Session()
    region = session.query(Region).filter_by(id = region_id).one()
    session.commit()
    return jsonify(region.to_dict())

@app.route('/regions/<region_id>/subregions', methods=['GET'])
def get_subregions(region_id):
    region_id = int(region_id)
    session = Session()
    subregions = session.query(Region).filter_by(parent_region_id = region_id).all()
    session.commit()
    return jsonify([r.to_dict() for r in subregions])

@app.route('/regions/<region_id>/results', methods=['GET'])
def get_results(region_id):
    session = Session()
    region = session.query(Region).filter_by(id = region_id).one()
    session.commit()
    results = region.results
    return jsonify([r.to_dict() for r in results])

@app.route('/parties/', methods=['GET'])
def get_parties():
    session = Session()
    parties = session.query(Party).all()
    session.commit()
    return jsonify([p.to_dict() for p in parties])
    
app.run(debug = True)