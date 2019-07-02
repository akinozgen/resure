@extends('layouts.app')

@section('content')

  <div class="container">
    <form class="card" style="width: 100%;" action="{{ route('profile_save_post') }}">
      <div class="card-body">
        <h5 class="card-title"><strong>{{ auth()->user()->name }}</strong> <small>Profile Info</small></h5>
        <div class="row">
          <div class="col-4 sm-4 xs-12">
            <div class="form-group">
              <label><strong>Profile Picture</strong></label>
              <div class="uploader">
                <input type="file" name="pp" accept="image/*" />
                <img src="{{ auth()->user()->pp_url }}" width="100%" class="img-thumbnail" tabindex="1">
              </div>
            </div>
          </div>
          <div class="col-8 sm-8 xs-12">
            <div class="form-group">
              <label><strong>Banner Picture</strong></label>
              <div class="uploader">
                <input type="file" name="pp" accept="image/*" />
                <img src="{{ auth()->user()->banner_url }}" width="100%" class="img-thumbnail" tabindex="1">
              </div>
            </div>
          </div>
        </div>
        <button class="btn btn-primary">Save</button>
      </div>
    </form>
  </div>
  
@endsection