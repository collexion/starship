class CatalogObjectsController < ApplicationController
  # GET /catalog_objects
  # GET /catalog_objects.json
  def index
    @catalog_objects = CatalogObject.all

    respond_to do |format|
      format.html # index.html.erb
      format.json { render json: @catalog_objects }
    end
  end

  # GET /catalog_objects/1
  # GET /catalog_objects/1.json
  def show
    @catalog_object = CatalogObject.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.json { render json: @catalog_object }
    end
  end

  # GET /catalog_objects/new
  # GET /catalog_objects/new.json
  def new
    @catalog_object = CatalogObject.new

    respond_to do |format|
      format.html # new.html.erb
      format.json { render json: @catalog_object }
    end
  end

  # GET /catalog_objects/1/edit
  def edit
    @catalog_object = CatalogObject.find(params[:id])
  end

  # POST /catalog_objects
  # POST /catalog_objects.json
  def create
    @catalog_object = CatalogObject.new(params[:catalog_object])

    respond_to do |format|
      if @catalog_object.save
        format.html { redirect_to @catalog_object, notice: 'Catalog object was successfully created.' }
        format.json { render json: @catalog_object, status: :created, location: @catalog_object }
      else
        format.html { render action: "new" }
        format.json { render json: @catalog_object.errors, status: :unprocessable_entity }
      end
    end
  end

  # PUT /catalog_objects/1
  # PUT /catalog_objects/1.json
  def update
    @catalog_object = CatalogObject.find(params[:id])

    respond_to do |format|
      if @catalog_object.update_attributes(params[:catalog_object])
        format.html { redirect_to @catalog_object, notice: 'Catalog object was successfully updated.' }
        format.json { head :ok }
      else
        format.html { render action: "edit" }
        format.json { render json: @catalog_object.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /catalog_objects/1
  # DELETE /catalog_objects/1.json
  def destroy
    @catalog_object = CatalogObject.find(params[:id])
    @catalog_object.destroy

    respond_to do |format|
      format.html { redirect_to catalog_objects_url }
      format.json { head :ok }
    end
  end
end
