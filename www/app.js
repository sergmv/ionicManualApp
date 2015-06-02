var app = angular.module('NotifyApp',['ionic','ngCordova']);

app.controller('NotifyCtrl', function($scope, $ionicModal, $ionicPopup, $ionicPlatform, $cordovaLocalNotification){

	// Create and load the Modal
	$ionicModal.fromTemplateUrl('new-notify.html', function(modal) {
		$scope.notifyModal = modal;
	}, {
		scope: $scope,
		animation: 'slide-in-up'
	});

	// Open our new task modal
	$scope.openModal = function() {
		$scope.notifyModal.show();
	};

	// Close the new task modal
	$scope.closeModal = function() {
		$scope.notifyModal.hide();
	};

	
	$ionicPlatform.ready(function() {
		$scope.getNotificationIds = function () {
			$cordovaLocalNotification.getScheduledIds().then(function (scheduledIds) {
				
				$scope.result = [];
				
				for(var key in scheduledIds) {
					var row = {'id': scheduledIds[key]};
                    $scope.result.push(row);
				}
			});
		};
		
		$scope.getNotificationIds();
		
		
		$scope.addNotification = function (task) {
			var now              = new Date().getTime(),
			_30_seconds_from_now = new Date(now + 30*1000);
			
			$cordovaLocalNotification.isScheduled(task.id).then(function (isScheduled) {
				if (isScheduled){
					$ionicPopup.alert({
						title: "Warning",
						template: "Notification with this ID is already scheduled"
					}).then(function(res) {
						task.id = "";
					});
				}else{
					$cordovaLocalNotification.add({
						id:      task.id,
						title:   'Notification',
						message: task.msg,
						repeat:  'daily',
						date:    _30_seconds_from_now
					});
					
					$ionicPopup.alert({
						title: "Done",
						template: "Notification set for daily @" + _30_seconds_from_now
					}).then(function(res) {
						$scope.notifyModal.hide();
						$scope.getNotificationIds();
						task.id = "";
						task.msg = "";
					});
				}
			});
		};
		
		
		$scope.cancelNotification = function (id) {
			$cordovaLocalNotification.cancel(id).then(function () {
				alert('callback for cancellation background notification'); // never get called
			});
			
			$ionicPopup.alert({
				title: "Done",
				template: "Notification " + id + " is cancelled"
			}).then(function(res) {
				$scope.getNotificationIds();
			});
			
		};
	});
	
});

