$(document).ready(function () {
  var whichTab;
  $('.button').on('click', function(e) {
    console.log(whichTab);
    var userName = $(".tab-content > div").eq(whichTab).find("#userName").val();
    console.log(userName);
    var password = $(".tab-content > div").eq(whichTab).find("#password").val();
    console.log(password);
    var email = $(".tab-content > div").eq(whichTab).find("#email").val();
    console.log(email);
    // console.log($("input:eq(1)").val());
    // $('input').each(function(index) {
    //   if($(this).val()==='') {
    //     alert("Please fill all fields!");
    //     $(this).focus();
    //   }
    // });

    $.ajax({
      method:"POST",
      url: "https://cryptic-retreat-3853.herokuapp.com/signin",
      // headers: {"Access-Control-Request-Headers","X-Requested-With"},
      data : {
        userName : userName,
        email: email,
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
