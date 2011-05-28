require 'test_helper'

class CatalogObjectsControllerTest < ActionController::TestCase
  setup do
    @catalog_object = catalog_objects(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:catalog_objects)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create catalog_object" do
    assert_difference('CatalogObject.count') do
      post :create, catalog_object: @catalog_object.attributes
    end

    assert_redirected_to catalog_object_path(assigns(:catalog_object))
  end

  test "should show catalog_object" do
    get :show, id: @catalog_object.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @catalog_object.to_param
    assert_response :success
  end

  test "should update catalog_object" do
    put :update, id: @catalog_object.to_param, catalog_object: @catalog_object.attributes
    assert_redirected_to catalog_object_path(assigns(:catalog_object))
  end

  test "should destroy catalog_object" do
    assert_difference('CatalogObject.count', -1) do
      delete :destroy, id: @catalog_object.to_param
    end

    assert_redirected_to catalog_objects_path
  end
end
