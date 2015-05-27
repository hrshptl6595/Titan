$(document).ready(function () {
  var whichTab;
  $('.button').on('click', function(e) {
    console.log("yay!");
    var userName = $(".tab-content > div").eq(whichTab).find("#userName").val();
    console.log(userName);
    var password = $(".tab-content > div").eq(whichTab).find("#password").val();
    console.log(password);
    // console.log($("input:eq(1)").val());
    // $('input').each(function(index) {
    //   if($(this).val()==='') {
    //     alert("Please fill all fields!");
    //     $(this).focus();
    //   }
    // });
    $ 

    $.ajax({
      method:"POST",
      url: "http://localhost:8080/signin",
      // headers: {"Access-Control-Request-Headers","X-Requested-With"},
      data : {
        userName : userName,
        password : password
      }
    })
    .success(function () {
      alert("signed in!");
    })
    .error(function() {
      alert("error!");
    });
    location.reload();
  });

  $('.tab').on('click', function (e) {
    whichTab = $(this).index();

    $(this).addClass('active');
    $(this).siblings().removeClass('active');
    console.log($(this).children().attr('href'));

    $('.tab-content > div').hide().eq(whichTab).show();
  });
});
