package tech.dongdongbh.mindwtr.notificationopenintents

import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition
import tech.dongdongbh.mindwtr.MainActivity

class NotificationOpenIntentsModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("NotificationOpenIntents")

    Function("consumePendingOpenPayload") {
      MainActivity.consumePendingNotificationOpenPayload()
    }
  }
}
